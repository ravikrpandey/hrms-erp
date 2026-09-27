import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';

export interface AttendanceDialogData {
  entry_type: 'IN' | 'OUT';
  employee_id?: any;
  employee_name?: string;
  employee_code?: string;
}

@Component({
  selector: 'app-attendance-verification-dialog',
  templateUrl: './attendance-verification-dialog.component.html',
  styleUrls: ['./attendance-verification-dialog.component.scss']
})
export class AttendanceVerificationDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  entryType: 'IN' | 'OUT' = 'IN';
  employeeName: string = '';
  employeeCode: string = '';

  webcamStream: MediaStream | null = null;
  cameraReady = false;
  cameraError = '';

  gpsLoading = true;
  gpsAcquired = false;
  gpsError = false;
  gpsErrorMessage = '';
  latitude: number | null = null;
  longitude: number | null = null;
  accuracy: number | null = null;

  isVerifying = false;
  isNotEnrolled = false;
  isEnrolling = false;
  verificationError = '';
  verificationSuccess = false;
  successData: any = null;
  successMessage = '';
  canFallback = false;
  isFallbackSubmitting = false;

  isFaceAligned = false;
  private faceTrackerInterval: any = null;
  private sampleCanvas: HTMLCanvasElement | null = null;
  private faceDetectorApi: any = null;
  private consecutiveAlignedCount = 0;
  private consecutiveMisalignedCount = 0;

  currentChallenge: 'TURN_LEFT' | 'TURN_RIGHT' | 'BLINK' = 'TURN_LEFT';
  challengeProgress = 0;
  challengeTarget = 1;
  challengeCompleted = false;
  challengeInstruction = '👉 Turn head slightly LEFT, then return to CENTER';
  burstFrames: string[] = [];
  turnPhase: 'IDLE' | 'TURNED' | 'RETURNED' = 'IDLE';

  private baselineX: number | null = null;
  private baselineY: number | null = null;
  private recentEyeVariances: number[] = [];
  private lastBlinkTime = 0;
  private lastLivenessBaselineTime = 0;

  private autoCloseTimer: any = null;

  constructor(
    public dialogRef: MatDialogRef<AttendanceVerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttendanceDialogData,
    private attendanceService: AttendanceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.entryType = this.data.entry_type || 'IN';
      this.employeeName = this.data.employee_name || '';
      this.employeeCode = this.data.employee_code || '';
    }
    try {
      const userStr = localStorage.getItem('signInUser');
      if (userStr) {
        const parsed = JSON.parse(userStr);
        if (!this.employeeCode) {
          this.employeeCode = parsed.employee_code || parsed.employeeCode || '';
        }
        if (!this.employeeName) {
          this.employeeName = `${parsed.first_name || ''} ${parsed.last_name || ''}`.trim();
        }
      }
    } catch (e) {}

    this.initLivenessChallenge();
    this.requestLocation();
    this.checkEnrollmentStatus();
  }

  checkEnrollmentStatus(): void {
    let empId = this.data?.employee_id || localStorage.getItem('EmpMainId');
    if (!empId) {
      try {
        const userStr = localStorage.getItem('signInUser');
        if (userStr) {
          const parsed = JSON.parse(userStr);
          empId = parsed.employee_id || parsed.employeeId || parsed.user_id || parsed.id;
        }
      } catch (e) {}
    }

    this.attendanceService.check_face_status(empId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.isNotEnrolled = !res.data.is_enrolled;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.warn('Could not check face enrollment status upfront:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.startCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
    this.stopFaceCenteringTracker();
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }

  requestLocation(): void {
    this.gpsLoading = true;
    this.gpsError = false;
    this.gpsErrorMessage = '';
    this.cdr.detectChanges();

    if (!('geolocation' in navigator)) {
      this.gpsLoading = false;
      this.gpsError = true;
      this.gpsErrorMessage = 'Geolocation is not supported by your browser.';
      this.cdr.detectChanges();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => {
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;
        this.accuracy = Math.round(pos.coords.accuracy);
        this.gpsAcquired = true;
        this.gpsLoading = false;
        this.gpsError = false;
        this.cdr.detectChanges();
      },
      (err: GeolocationPositionError) => {
        this.gpsLoading = false;
        this.gpsAcquired = false;
        this.gpsError = true;
        switch (err.code) {
          case err.PERMISSION_DENIED:
            this.gpsErrorMessage = 'Location permission denied. Please allow location access.';
            break;
          case err.POSITION_UNAVAILABLE:
            this.gpsErrorMessage = 'Location information unavailable. Please check GPS settings.';
            break;
          case err.TIMEOUT:
            this.gpsErrorMessage = 'Location request timed out. Retrying...';
            break;
          default:
            this.gpsErrorMessage = 'Unable to determine location. Please retry.';
        }
        this.cdr.detectChanges();
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  }

  startCamera(): void {
    this.cameraReady = false;
    this.cameraError = '';
    this.cdr.detectChanges();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.cameraError = 'Camera access is not supported by your browser.';
      this.cdr.detectChanges();
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      })
      .then((stream: MediaStream) => {
        this.webcamStream = stream;
        const video = this.videoElement?.nativeElement;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play()
              .then(() => {
                this.cameraReady = true;
                this.startFaceCenteringTracker();
                this.cdr.detectChanges();
              })
              .catch(() => {
                this.cameraError = 'Failed to start video playback.';
                this.stopCamera();
                this.cdr.detectChanges();
              });
          };
        }
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          this.cameraError = 'Camera permission denied. Please grant camera access in browser settings.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          this.cameraError = 'No camera device found on this system.';
        } else {
          this.cameraError = 'Unable to access camera: ' + (err.message || 'Unknown error');
        }
        this.cdr.detectChanges();
      });
  }

  stopCamera(): void {
    this.stopFaceCenteringTracker();
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach((track) => track.stop());
      this.webcamStream = null;
    }
    this.cameraReady = false;
  }

  captureAndVerify(): void {
    if (!this.cameraReady) {
      this.verificationError = 'Camera is not ready. Please wait or reload.';
      return;
    }

    const video = this.videoElement?.nativeElement;
    const canvas = this.canvasElement?.nativeElement;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      this.verificationError = 'Camera frame not ready. Please try again.';
      return;
    }

    if (!this.challengeCompleted) {
      this.verificationError = `⚠️ Real Face Verification Required: ${this.challengeInstruction}. Showing a photo or screen from a mobile phone is strictly prohibited.`;
      this.cdr.detectChanges();
      return;
    }

    this.isVerifying = true;
    this.verificationError = '';
    this.cdr.detectChanges();

    try {
      const targetW = 480;
      const targetH = Math.round(targetW * (video.videoHeight / (video.videoWidth || 640))) || 360;
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        this.isVerifying = false;
        this.verificationError = 'Failed to capture frame from camera.';
        this.cdr.detectChanges();
        return;
      }

      ctx.drawImage(video, 0, 0, targetW, targetH);
      const faceImageBase64 = canvas.toDataURL('image/jpeg', 0.78);

      const payload: any = {
        entry_type: this.entryType,
        face_image_base64: faceImageBase64,
        latitude: this.latitude,
        longitude: this.longitude,
        accuracy: this.accuracy,
        client_timestamp: new Date().toISOString(),
        burst_frames: this.burstFrames.length > 0 ? this.burstFrames : [faceImageBase64],
        liveness_data: {
          challenge_type: this.currentChallenge,
          is_passed: this.challengeCompleted,
          progress: this.challengeProgress,
          target: this.challengeTarget
        }
      };

      let empId = this.data?.employee_id || localStorage.getItem('EmpMainId');
      if (!empId) {
        try {
          const userStr = localStorage.getItem('signInUser');
          if (userStr) {
            const parsed = JSON.parse(userStr);
            empId = parsed.employee_id || parsed.employeeId || parsed.user_id || parsed.id;
          }
        } catch (e) {}
      }
      if (empId) {
        payload.employee_id = empId;
      }

      this.attendanceService.verified_punch(payload).subscribe({
        next: (res: any) => {
          this.isVerifying = false;
          if (res && (res.code === 200 || res.success)) {
            this.verificationSuccess = true;
            this.successData = res.data;
            if (res.data?.employee_name) {
              this.employeeName = res.data.employee_name;
            }
            if (res.data?.employee_code) {
              this.employeeCode = res.data.employee_code;
            }
            this.successMessage = res.message || `Checked ${this.entryType} Verified Successfully!`;
            this.stopCamera();
            this.cdr.detectChanges();

            this.autoCloseTimer = setTimeout(() => {
              this.dialogRef.close({
                success: true,
                entry_type: this.entryType,
                message: this.successMessage,
                data: this.successData
              });
            }, 5000);
          } else {
            this.verificationError = res?.message || 'Verification failed. Please try again.';
            this.cdr.detectChanges();
          }
        },
        error: (err: any) => {
          this.isVerifying = false;
          console.error('Punch verification error:', err);
          const serverMsg = err.error?.message || err.message;
          const errorCode = err.error?.error_code;

          if (errorCode === 'SPOOF_DETECTED') {
            this.isNotEnrolled = false;
            this.canFallback = false;
            this.verificationError = serverMsg || 'Live person verification failed: Photo or screen detected. Showing photos or recorded videos from mobile screens is prohibited.';
            this.initLivenessChallenge();
          } else if (errorCode === 'NOT_ENROLLED' || (serverMsg && serverMsg.toLowerCase().includes('not registered'))) {
            this.isNotEnrolled = true;
            this.canFallback = true;
            this.verificationError = 'Your face is not registered yet. Please enroll your face or proceed with a live fallback selfie.';
          } else if (errorCode === 'MISMATCH') {
            this.isNotEnrolled = false;
            this.canFallback = true;
            this.verificationError = serverMsg || 'Face does not match the registered employee profile. Please look directly into the camera or proceed with Live Selfie Fallback.';
          } else if (err.status === 422 || err.error?.can_fallback) {
            this.canFallback = true;
            this.verificationError = serverMsg || 'Face verification failed. You can retry or proceed by capturing a live fallback photo.';
          } else if (err.status === 400) {
            this.verificationError = serverMsg || 'Location verification failed. Ensure you are within your office branch.';
          } else if (err.status === 403) {
            this.verificationError = serverMsg || 'Access denied or employee record inactive.';
          } else if (err.status === 401) {
            this.verificationError = 'Session expired. Please log in again.';
          } else {
            this.verificationError = serverMsg || 'Attendance verification service error. Please try again.';
          }
          this.cdr.detectChanges();
        }
      });
    } catch (e: any) {
      this.isVerifying = false;
      this.verificationError = 'Capture error: ' + (e.message || 'Unknown');
      this.cdr.detectChanges();
    }
  }

  proceedWithFallback(): void {
    if (!this.cameraReady) {
      this.verificationError = 'Camera is not ready. Please wait or reload.';
      return;
    }
    const video = this.videoElement?.nativeElement;
    const canvas = this.canvasElement?.nativeElement;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      this.verificationError = 'Camera frame not ready. Please look at the camera and try again.';
      return;
    }

    this.isFallbackSubmitting = true;
    this.verificationError = '';
    this.cdr.detectChanges();

    try {
      const targetW = 480;
      const targetH = Math.round(targetW * (video.videoHeight / (video.videoWidth || 640))) || 360;
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        this.isFallbackSubmitting = false;
        this.verificationError = 'Failed to capture frame from camera.';
        this.cdr.detectChanges();
        return;
      }

      ctx.drawImage(video, 0, 0, targetW, targetH);
      const faceImageBase64 = canvas.toDataURL('image/jpeg', 0.78);

      const payload: any = {
        entry_type: this.entryType,
        face_image_base64: faceImageBase64,
        latitude: this.latitude,
        longitude: this.longitude,
        accuracy: this.accuracy,
        client_timestamp: new Date().toISOString(),
        is_fallback: true
      };

      let empId = this.data?.employee_id || localStorage.getItem('EmpMainId');
      if (!empId) {
        try {
          const userStr = localStorage.getItem('signInUser');
          if (userStr) {
            const parsed = JSON.parse(userStr);
            empId = parsed.employee_id || parsed.employeeId || parsed.user_id || parsed.id;
          }
        } catch (e) {}
      }
      if (empId) {
        payload.employee_id = empId;
      }

      this.attendanceService.verified_punch(payload).subscribe({
        next: (res: any) => {
          this.isFallbackSubmitting = false;
          if (res && (res.code === 200 || res.success)) {
            this.verificationSuccess = true;
            this.successData = res.data;
            if (res.data?.employee_name) {
              this.employeeName = res.data.employee_name;
            }
            if (res.data?.employee_code) {
              this.employeeCode = res.data.employee_code;
            }
            this.successMessage = res.message || `Checked ${this.entryType} Recorded with Live Selfie (Fallback Mode)!`;
            this.stopCamera();
            this.cdr.detectChanges();

            this.autoCloseTimer = setTimeout(() => {
              this.dialogRef.close({
                success: true,
                entry_type: this.entryType,
                message: this.successMessage,
                data: this.successData,
                is_fallback: true
              });
            }, 5000);
          } else {
            this.verificationError = res?.message || 'Fallback submission failed. Please try again.';
            this.cdr.detectChanges();
          }
        },
        error: (err: any) => {
          this.isFallbackSubmitting = false;
          console.error('Fallback punch error:', err);
          this.verificationError = err.error?.message || err.message || 'Location verification or system error during fallback punch.';
          this.cdr.detectChanges();
        }
      });
    } catch (e: any) {
      this.isFallbackSubmitting = false;
      this.verificationError = 'Capture error: ' + (e.message || 'Unknown');
      this.cdr.detectChanges();
    }
  }

  enrollFace(): void {
    if (!this.cameraReady) {
      this.verificationError = 'Camera is not ready. Please wait or reload.';
      return;
    }
    const video = this.videoElement?.nativeElement;
    const canvas = this.canvasElement?.nativeElement;
    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      this.verificationError = 'Camera frame not ready. Please look at the camera and try again.';
      this.cdr.detectChanges();
      return;
    }

    this.isEnrolling = true;
    this.verificationError = '';
    this.cdr.detectChanges();

    try {
      const targetW = 480;
      const targetH = Math.round(targetW * (video.videoHeight / (video.videoWidth || 640))) || 360;
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        this.isEnrolling = false;
        this.verificationError = 'Failed to capture frame from camera.';
        this.cdr.detectChanges();
        return;
      }

      ctx.drawImage(video, 0, 0, targetW, targetH);
      const faceImageBase64 = canvas.toDataURL('image/jpeg', 0.78);

      const payload: any = { face_image_base64: faceImageBase64 };
      let empId = this.data?.employee_id || localStorage.getItem('EmpMainId');
      if (!empId) {
        try {
          const userStr = localStorage.getItem('signInUser');
          if (userStr) {
            const parsed = JSON.parse(userStr);
            empId = parsed.employee_id || parsed.employeeId || parsed.user_id || parsed.id;
          }
        } catch (e) {}
      }
      if (empId) {
        payload.employee_id = empId;
      }

      this.attendanceService.enroll_face(payload).subscribe({
        next: (res: any) => {
          this.isEnrolling = false;
          this.isNotEnrolled = false;
          this.verificationError = '';
          this.cdr.detectChanges();
          this.captureAndVerify();
        },
        error: (enrollErr: any) => {
          this.isEnrolling = false;
          this.isNotEnrolled = true;
          this.verificationError = enrollErr.error?.message || enrollErr.message || 'Failed to enroll face. Ensure your face is clearly visible and well-lit.';
          this.cdr.detectChanges();
        }
      });
    } catch (e: any) {
      this.isEnrolling = false;
      this.verificationError = 'Enrollment error: ' + (e.message || 'Unknown');
      this.cdr.detectChanges();
    }
  }

  retry(): void {
    this.verificationError = '';
    if (!this.cameraReady) {
      this.startCamera();
    }
    if (this.gpsError) {
      this.requestLocation();
    }
  }

  closeSuccessImmediate(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
    this.dialogRef.close({
      success: true,
      entry_type: this.entryType,
      message: this.successMessage,
      data: this.successData
    });
  }

  close(): void {
    this.stopCamera();
    this.dialogRef.close({ success: false });
  }

  private startFaceCenteringTracker(): void {
    this.stopFaceCenteringTracker();
    if (!this.faceDetectorApi && typeof (window as any).FaceDetector === 'function') {
      try {
        this.faceDetectorApi = new (window as any).FaceDetector({ maxDetectedFaces: 1, fastMode: true });
      } catch (e) {
        this.faceDetectorApi = null;
      }
    }

    this.faceTrackerInterval = setInterval(() => {
      this.evaluateFaceCentering();
    }, 100);
  }

  private stopFaceCenteringTracker(): void {
    if (this.faceTrackerInterval) {
      clearInterval(this.faceTrackerInterval);
      this.faceTrackerInterval = null;
    }
    this.consecutiveAlignedCount = 0;
    this.consecutiveMisalignedCount = 0;
  }

  private evaluateFaceCentering(): void {
    if (!this.cameraReady || this.isVerifying || this.isEnrolling || this.isFallbackSubmitting) {
      return;
    }

    const video = this.videoElement?.nativeElement;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0 || video.paused || video.ended) {
      return;
    }

    this.evaluateSkinCentroid(video);
  }

  private evaluateSkinCentroid(video: HTMLVideoElement): void {
    try {
      if (!this.sampleCanvas) {
        this.sampleCanvas = document.createElement('canvas');
        this.sampleCanvas.width = 120;
        this.sampleCanvas.height = 90;
      }

      const ctx = this.sampleCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, 120, 90);
      const imgData = ctx.getImageData(0, 0, 120, 90).data;

      let totalSkinPixels = 0;
      let skinPixelsInsideOval = 0;
      let sumX = 0;
      let sumY = 0;
      const w = 120;
      const h = 90;

      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          const idx = (y * w + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];

          const maxVal = Math.max(r, g, b);
          const minVal = Math.min(r, g, b);
          const isSkin =
            r > 60 &&
            g > 30 &&
            b > 20 &&
            maxVal - minVal > 15 &&
            Math.abs(r - g) > 12 &&
            r > g &&
            r > b;

          if (isSkin) {
            totalSkinPixels++;
            const normX = x / w;
            const normY = y / h;

            const dx = (normX - 0.5) / 0.28;
            const dy = (normY - 0.48) / 0.36;
            if (dx * dx + dy * dy <= 1.0) {
              skinPixelsInsideOval++;
              sumX += normX;
              sumY += normY;
            }
          }
        }
      }

      const hasSufficientSkinInOval = skinPixelsInsideOval >= 26;
      const skinDistributionGood = totalSkinPixels > 0 && (skinPixelsInsideOval / totalSkinPixels) >= 0.18;

      let isCentered = false;
      let avgX = 0.5;
      let avgY = 0.48;

      if (hasSufficientSkinInOval && skinDistributionGood) {
        avgX = sumX / skinPixelsInsideOval;
        avgY = sumY / skinPixelsInsideOval;
        const distFromCenterX = Math.abs(avgX - 0.5);
        const distFromCenterY = Math.abs(avgY - 0.48);
        if (distFromCenterX <= 0.22 && distFromCenterY <= 0.25) {
          isCentered = true;
          if (this.baselineX === null) {
            this.baselineX = avgX;
            this.baselineY = avgY;
          }
        }
      }

      this.processLivenessChallenge(avgX, avgY, w, h, imgData, isCentered);
      this.applyAlignmentResult(isCentered);
    } catch (e) {}
  }

  private applyAlignmentResult(aligned: boolean): void {
    if (this.challengeCompleted) {
      this.isFaceAligned = true;
      return;
    }

    if (aligned) {
      this.consecutiveAlignedCount++;
      this.consecutiveMisalignedCount = 0;
      if (this.consecutiveAlignedCount >= 1 && !this.isFaceAligned) {
        this.isFaceAligned = true;
        this.cdr.detectChanges();
      }
    } else {
      if (this.turnPhase === 'TURNED') {
        return;
      }
      this.consecutiveMisalignedCount++;
      this.consecutiveAlignedCount = 0;
      if (this.consecutiveMisalignedCount >= 2 && this.isFaceAligned) {
        this.isFaceAligned = false;
        this.cdr.detectChanges();
      }
    }
  }

  initLivenessChallenge(): void {
    const challenges: ('TURN_LEFT' | 'TURN_RIGHT' | 'BLINK')[] = [
      'TURN_LEFT',
      'TURN_RIGHT',
      'TURN_LEFT',
      'TURN_RIGHT',
      'BLINK'
    ];
    this.currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    this.resetChallengeProgress();
  }

  switchChallenge(): void {
    if (this.isVerifying || this.isEnrolling) return;
    const challenges: ('TURN_LEFT' | 'TURN_RIGHT' | 'BLINK')[] = [
      'TURN_LEFT',
      'TURN_RIGHT',
      'BLINK'
    ];
    const currentIndex = challenges.indexOf(this.currentChallenge);
    const nextIndex = (currentIndex + 1) % challenges.length;
    this.currentChallenge = challenges[nextIndex];
    this.resetChallengeProgress();
    this.cdr.detectChanges();
  }

  private resetChallengeProgress(): void {
    this.challengeProgress = 0;
    this.challengeCompleted = false;
    this.turnPhase = 'IDLE';
    this.baselineX = null;
    this.baselineY = null;
    this.recentEyeVariances = [];
    this.burstFrames = [];

    switch (this.currentChallenge) {
      case 'TURN_LEFT':
        this.challengeTarget = 1;
        this.challengeInstruction = '👉 Turn head slightly LEFT, then return to CENTER';
        break;
      case 'TURN_RIGHT':
        this.challengeTarget = 1;
        this.challengeInstruction = '👉 Turn head slightly RIGHT, then return to CENTER';
        break;
      case 'BLINK':
        this.challengeTarget = 1;
        this.challengeInstruction = '👁️ Please BLINK your eyes naturally';
        break;
    }
  }

  private processLivenessChallenge(avgX: number, avgY: number, w: number, h: number, imgData: Uint8ClampedArray, isCentered: boolean): void {
    if (this.challengeCompleted) return;

    if (this.currentChallenge === 'TURN_LEFT') {
      const bX = this.baselineX || 0.5;
      const deltaX = avgX - bX;
      if (this.turnPhase === 'IDLE') {
        if (Math.abs(deltaX) >= 0.045 || avgX < 0.43 || avgX > 0.57) {
          this.turnPhase = 'TURNED';
          this.challengeInstruction = '👉 Great! Now turn head back to CENTER';
          this.captureBurstSample();
          this.cdr.detectChanges();
        }
      } else if (this.turnPhase === 'TURNED') {
        if ((Math.abs(deltaX) <= 0.028 || (avgX >= 0.46 && avgX <= 0.54)) && isCentered) {
          this.turnPhase = 'RETURNED';
          this.challengeCompleted = true;
          this.challengeProgress = 1;
          this.challengeInstruction = '✅ Live Face Verified!';
          this.isFaceAligned = true;
          this.captureBurstSample();
          this.cdr.detectChanges();
        }
      }
      return;
    }

    if (this.currentChallenge === 'TURN_RIGHT') {
      const bX = this.baselineX || 0.5;
      const deltaX = avgX - bX;
      if (this.turnPhase === 'IDLE') {
        if (Math.abs(deltaX) >= 0.045 || avgX < 0.43 || avgX > 0.57) {
          this.turnPhase = 'TURNED';
          this.challengeInstruction = '👈 Great! Now turn head back to CENTER';
          this.captureBurstSample();
          this.cdr.detectChanges();
        }
      } else if (this.turnPhase === 'TURNED') {
        if ((Math.abs(deltaX) <= 0.028 || (avgX >= 0.46 && avgX <= 0.54)) && isCentered) {
          this.turnPhase = 'RETURNED';
          this.challengeCompleted = true;
          this.challengeProgress = 1;
          this.challengeInstruction = '✅ Live Face Verified!';
          this.isFaceAligned = true;
          this.captureBurstSample();
          this.cdr.detectChanges();
        }
      }
      return;
    }

    if (this.currentChallenge === 'BLINK') {
      if (!isCentered) return;

      const eyeLuminances: number[] = [];
      const startY = Math.max(0, Math.floor((avgY - 0.12) * h));
      const endY = Math.min(h - 1, Math.ceil((avgY - 0.02) * h));
      const startX = Math.max(0, Math.floor((avgX - 0.14) * w));
      const endX = Math.min(w - 1, Math.ceil((avgX + 0.14) * w));

      for (let ey = startY; ey <= endY; ey++) {
        for (let ex = startX; ex <= endX; ex++) {
          const idx = (ey * w + ex) * 4;
          eyeLuminances.push(0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2]);
        }
      }

      if (eyeLuminances.length > 20) {
        let sum = 0, sumSq = 0;
        for (let i = 0; i < eyeLuminances.length; i++) {
          sum += eyeLuminances[i];
          sumSq += eyeLuminances[i] * eyeLuminances[i];
        }
        const mean = sum / eyeLuminances.length;
        const variance = Math.max(0, (sumSq / eyeLuminances.length) - (mean * mean));
        const stdDev = Math.sqrt(variance);

        this.recentEyeVariances.push(stdDev);
        if (this.recentEyeVariances.length > 12) {
          this.recentEyeVariances.shift();
        }

        const maxVariance = Math.max(...this.recentEyeVariances);
        const now = Date.now();
        if (maxVariance > 10 && stdDev < maxVariance * 0.72 && (now - this.lastBlinkTime > 350)) {
          this.lastBlinkTime = now;
          this.challengeProgress++;
          this.captureBurstSample();

          if (this.challengeProgress >= this.challengeTarget) {
            this.challengeCompleted = true;
            this.challengeInstruction = '✅ Live Face Verified!';
            this.isFaceAligned = true;
          }
          this.cdr.detectChanges();
        }
      }
    }
  }

  private captureBurstSample(): void {
    const video = this.videoElement?.nativeElement;
    if (!video || video.videoWidth === 0) return;
    try {
      const c = document.createElement('canvas');
      c.width = 320;
      c.height = 240;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, 320, 240);
        const dataUrl = c.toDataURL('image/jpeg', 0.70);
        this.burstFrames.push(dataUrl);
        if (this.burstFrames.length > 2) {
          this.burstFrames.shift();
        }
      }
    } catch (e) {}
  }
}
