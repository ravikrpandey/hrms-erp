const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
const path = require('path');
const fs = require('fs');

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

async function loadModels() {
    if (modelsLoaded) return;

    const modelPath = path.join(__dirname, '../modelsss');

    await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);

    modelsLoaded = true;
}

async function getFaceDescriptor(imagePath) {
    await loadModels();

    const img = await canvas.loadImage(imagePath);
    const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!detection) return null;

    return detection.descriptor;
}

async function findMatchingPatients(uploadedImagePath, storedPatients, threshold = 0.5) {
    await loadModels();

    const uploadedDescriptor = await getFaceDescriptor(uploadedImagePath);

    if (!uploadedDescriptor) {
        throw new Error('No face detected in uploaded photo');
    }

    const matches = [];

    for (const patient of storedPatients) {
        if (!patient.face_descriptor) continue;

        let storedDescriptor;

        try {
            storedDescriptor = new Float32Array(JSON.parse(patient.face_descriptor));
        } catch {
            continue;
        }

        const distance = faceapi.euclideanDistance(uploadedDescriptor, storedDescriptor);

        if (distance <= threshold) {
            matches.push({ ...patient, match_score: (1 - distance).toFixed(2) });
        }
    }

    matches.sort((a, b) => b.match_score - a.match_score);

    return matches;
}

async function verifyEmployeeFace(imageSource, storedDescriptorJson, threshold = 0.45) {
    await loadModels();

    if (!storedDescriptorJson) {
        return {
            success: false,
            status: "NOT_ENROLLED",
            matchScore: null,
            distance: null,
            error: "Biometric face template not found for employee. Please contact HR to enroll your face."
        };
    }

    let storedDescriptor;
    try {
        const parsed = typeof storedDescriptorJson === 'string'
            ? JSON.parse(storedDescriptorJson)
            : storedDescriptorJson;
        storedDescriptor = new Float32Array(parsed);
        if (storedDescriptor.length !== 128) {
            return {
                success: false,
                status: "NOT_ENROLLED",
                matchScore: null,
                distance: null,
                error: "Invalid enrolled face template structure."
            };
        }
    } catch (parseErr) {
        return {
            success: false,
            status: "NOT_ENROLLED",
            matchScore: null,
            distance: null,
            error: "Corrupted biometric template. Re-enrollment required."
        };
    }

    let img;
    try {
        if (typeof imageSource === 'string' && imageSource.startsWith('data:image')) {
            const base64Data = imageSource.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            img = await canvas.loadImage(buffer);
        } else if (Buffer.isBuffer(imageSource)) {
            img = await canvas.loadImage(imageSource);
        } else {
            img = await canvas.loadImage(imageSource);
        }

        if (img && img.width > 500) {
            const targetW = 480;
            const targetH = Math.round(img.height * (targetW / img.width));
            const rescaleCanvas = canvas.createCanvas(targetW, targetH);
            const rescaleCtx = rescaleCanvas.getContext('2d');
            rescaleCtx.drawImage(img, 0, 0, targetW, targetH);
            img = rescaleCanvas;
        }
    } catch (loadErr) {
        return {
            success: false,
            status: "NO_FACE",
            matchScore: null,
            distance: null,
            error: "Failed to process image frame: " + loadErr.message
        };
    }

    let detection = null;
    try {
        detection = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor();
    } catch (tinyErr) {
    }

    if (!detection) {
        detection = await faceapi
            .detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor();
    }

    if (!detection) {
        return {
            success: false,
            status: "NO_FACE",
            matchScore: null,
            distance: null,
            error: "No clear face detected in the live frame. Please ensure proper lighting and face the camera directly."
        };
    }

    const distance = faceapi.euclideanDistance(detection.descriptor, storedDescriptor);
    const matchScore = Math.max(0, 1 - distance);

    if (distance <= threshold) {
        return {
            success: true,
            status: "VERIFIED",
            matchScore: Math.round(matchScore * 100) / 100,
            distance: Math.round(distance * 1000) / 1000,
            error: null,
            detection,
            img
        };
    } else {
        return {
            success: false,
            status: "MISMATCH",
            matchScore: Math.round(matchScore * 100) / 100,
            distance: Math.round(distance * 1000) / 1000,
            error: "Face does not match the registered employee profile. Please look directly into the camera or proceed with Live Selfie Fallback."
        };
    }
}

async function enrollFaceDescriptor(imageSource) {
    await loadModels();

    let img;
    try {
        if (typeof imageSource === 'string' && imageSource.startsWith('data:image')) {
            const base64Data = imageSource.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            img = await canvas.loadImage(buffer);
        } else if (Buffer.isBuffer(imageSource)) {
            img = await canvas.loadImage(imageSource);
        } else {
            img = await canvas.loadImage(imageSource);
        }

        if (img && img.width > 500) {
            const targetW = 480;
            const targetH = Math.round(img.height * (targetW / img.width));
            const rescaleCanvas = canvas.createCanvas(targetW, targetH);
            const rescaleCtx = rescaleCanvas.getContext('2d');
            rescaleCtx.drawImage(img, 0, 0, targetW, targetH);
            img = rescaleCanvas;
        }
    } catch (loadErr) {
        return {
            success: false,
            error: "Failed to process image frame: " + loadErr.message
        };
    }

    let detection = null;
    try {
        detection = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor();
    } catch (tinyErr) {}

    if (!detection) {
        detection = await faceapi
            .detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor();
    }

    if (!detection) {
        return {
            success: false,
            error: "No clear face detected in the photo. Please look directly into the camera in good lighting."
        };
    }

    const descriptorArray = Array.from(detection.descriptor);
    return {
        success: true,
        descriptorJson: JSON.stringify(descriptorArray)
    };
}

function calculateEyeAspectRatio(eye) {
    if (!eye || eye.length < 6) return 0;
    const p1 = eye[0], p2 = eye[1], p3 = eye[2], p4 = eye[3], p5 = eye[4], p6 = eye[5];
    const distA = Math.hypot(p2.x - p6.x, p2.y - p6.y);
    const distB = Math.hypot(p3.x - p5.x, p3.y - p5.y);
    const distC = Math.hypot(p1.x - p4.x, p1.y - p4.y);
    if (distC === 0) return 0;
    return (distA + distB) / (2.0 * distC);
}

function detectScreenArtifacts(img, detection) {
    if (!detection || !img) return { isSpoof: false, reason: null };
    try {
        const box = detection.detection ? detection.detection.box : detection.box;
        if (!box) return { isSpoof: false, reason: null };

        const cropW = Math.max(1, Math.round(box.width));
        const cropH = Math.max(1, Math.round(box.height));
        const c = canvas.createCanvas(cropW, cropH);
        const ctx = c.getContext('2d');
        ctx.drawImage(img, box.x, box.y, box.width, box.height, 0, 0, cropW, cropH);
        const imgData = ctx.getImageData(0, 0, cropW, cropH).data;

        let blownOutHighlightPixels = 0;
        const totalPixels = cropW * cropH;

        for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            if (r >= 252 && g >= 252 && b >= 252) {
                blownOutHighlightPixels++;
            }
        }

        const glareRatio = blownOutHighlightPixels / totalPixels;
        if (glareRatio > 0.22) {
            return {
                isSpoof: true,
                reason: `Digital screen reflection / glass glare detected (${(glareRatio * 100).toFixed(1)}%). Mobile screen presentation is prohibited.`
            };
        }
    } catch (e) {
    }
    return { isSpoof: false, reason: null };
}

async function verifyLivenessAndMatch(imageSource, burstFrames, storedDescriptorJson, threshold = 0.48, livenessMetadata = null) {
    await loadModels();

    const baseResult = await verifyEmployeeFace(imageSource, storedDescriptorJson, threshold);
    if (!baseResult.success) {
        return baseResult;
    }

    const det1 = baseResult.detection;
    const img1 = baseResult.img;

    if (img1 && det1) {
        const screenCheck = detectScreenArtifacts(img1, det1);
        if (screenCheck.isSpoof) {
            delete baseResult.detection;
            delete baseResult.img;
            return {
                success: false,
                status: "SPOOF_DETECTED",
                matchScore: baseResult.matchScore,
                distance: baseResult.distance,
                error: "Live person verification failed: " + screenCheck.reason
            };
        }
    }

    if (livenessMetadata && !livenessMetadata.is_passed) {
        delete baseResult.detection;
        delete baseResult.img;
        return {
            success: false,
            status: "SPOOF_DETECTED",
            matchScore: baseResult.matchScore,
            distance: baseResult.distance,
            error: "Real person verification required: Active face movement challenge was not completed. Static photos or mobile phone screens are strictly prohibited."
        };
    }

    if (Array.isArray(burstFrames) && burstFrames.length > 0 && det1) {
        const actionFrameSource = burstFrames[0];
        try {
            let actionImg;
            if (typeof actionFrameSource === 'string' && actionFrameSource.startsWith('data:image')) {
                actionImg = await canvas.loadImage(Buffer.from(actionFrameSource.split(',')[1], 'base64'));
            } else if (Buffer.isBuffer(actionFrameSource)) {
                actionImg = await canvas.loadImage(actionFrameSource);
            }

            if (actionImg && actionImg.width > 360) {
                const targetW = 320;
                const targetH = Math.round(actionImg.height * (targetW / actionImg.width));
                const rescaleCanvas = canvas.createCanvas(targetW, targetH);
                const rescaleCtx = rescaleCanvas.getContext('2d');
                rescaleCtx.drawImage(actionImg, 0, 0, targetW, targetH);
                actionImg = rescaleCanvas;
            }

            if (actionImg) {
                let det2 = null;
                try {
                    det2 = await faceapi
                        .detectSingleFace(actionImg, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                        .withFaceLandmarks();
                } catch (e) {}
                if (!det2) {
                    det2 = await faceapi.detectSingleFace(actionImg).withFaceLandmarks();
                }
                if (det2) {
                    const screenCheck2 = detectScreenArtifacts(actionImg, det2);
                    if (screenCheck2.isSpoof) {
                        delete baseResult.detection;
                        delete baseResult.img;
                        return {
                            success: false,
                            status: "SPOOF_DETECTED",
                            matchScore: baseResult.matchScore,
                            distance: baseResult.distance,
                            error: "Live person verification failed: " + screenCheck2.reason
                        };
                    }

                    const pts1 = det1.landmarks.positions;
                    const pts2 = det2.landmarks.positions;
                    const w1 = img1.width || 480;
                    const h1 = img1.height || 360;
                    const w2 = actionImg.width || 320;
                    const h2 = actionImg.height || 240;

                    let frameDisplacement = 0;
                    for (let p = 0; p < pts1.length; p++) {
                        const nx1 = pts1[p].x / w1;
                        const ny1 = pts1[p].y / h1;
                        const nx2 = pts2[p].x / w2;
                        const ny2 = pts2[p].y / h2;
                        frameDisplacement += Math.hypot(nx1 - nx2, ny1 - ny2);
                    }
                    frameDisplacement /= pts1.length;

                    const ear1 = (calculateEyeAspectRatio(det1.landmarks.getLeftEye()) + calculateEyeAspectRatio(det1.landmarks.getRightEye())) / 2.0;
                    const ear2 = (calculateEyeAspectRatio(det2.landmarks.getLeftEye()) + calculateEyeAspectRatio(det2.landmarks.getRightEye())) / 2.0;
                    const earDelta = Math.abs(ear1 - ear2);

                    if (frameDisplacement < 0.003 && earDelta < 0.015) {
                        delete baseResult.detection;
                        delete baseResult.img;
                        return {
                            success: false,
                            status: "SPOOF_DETECTED",
                            matchScore: baseResult.matchScore,
                            distance: baseResult.distance,
                            error: "Liveness verification failed: Static or frozen image detected. Showing a captured photo or mobile screen is prohibited."
                        };
                    }

                    const isTurnChallenge = livenessMetadata?.challenge_type === 'TURN_LEFT' || livenessMetadata?.challenge_type === 'TURN_RIGHT';
                    if (isTurnChallenge && frameDisplacement < 0.012) {
                        delete baseResult.detection;
                        delete baseResult.img;
                        return {
                            success: false,
                            status: "SPOOF_DETECTED",
                            matchScore: baseResult.matchScore,
                            distance: baseResult.distance,
                            error: "Liveness verification failed: Insufficient physical face rotation detected. Please turn your head as prompted on screen."
                        };
                    }
                }
            }
        } catch (e) {
            console.warn("Fast action frame analysis skipped:", e.message);
        }
    }

    delete baseResult.detection;
    delete baseResult.img;

    return {
        ...baseResult,
        liveness_status: "VERIFIED"
    };
}

module.exports = {
    getFaceDescriptor,
    findMatchingPatients,
    verifyEmployeeFace,
    verifyLivenessAndMatch,
    calculateEyeAspectRatio,
    detectScreenArtifacts,
    enrollFaceDescriptor,
    loadModels
};
