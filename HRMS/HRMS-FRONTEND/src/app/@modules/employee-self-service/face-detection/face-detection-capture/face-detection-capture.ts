import { Component, ElementRef, ViewChild, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';

@Component({
  selector: 'app-face-detection-capture',
  templateUrl: './face-detection-capture.html',
  styleUrls: ['./face-detection-capture.scss'],
})
export class FaceDetectionCapture implements OnInit, OnDestroy {
  // ============ UI STATE ============
  showPhotoModal = false;
  webcamActive = false;
  capturedImageUrl: string | null = null;
  photoModalError = '';
  photoPreview: string | null = null;
  isLoading = false;
  searchCompleted = false;

  // ============ GPS STATE ============
  latitude: number | null = null;
  longitude: number | null = null;
  accuracy: number | null = null;
  gpsAcquired: boolean = false;
  gpsStatus: string = 'Acquiring GPS...';

  // ============ EMPLOYEE/ATTENDANCE ============
  entity_id: string = '';
  employeeData: any = null;
  attendanceResponse: any = null;
  attendanceStatus: string = '';
  baseUrl: string = environment.serverUrl;
  isInMode: boolean = true;
  todayDate: string = '';
  currentTime: string = '';

  // ============ LISTING DATA ============
  matchedEmployees: any[] = [];
  showListing: boolean = false;
  selectedEmployee: any = null;
  attendanceSummary: any = null;
  dateInfo: any = null;

  // ============ WEBCAM ============
  private webcamStream: MediaStream | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private attendanceService: AttendanceService
  ) { }

  // ============ LIFECYCLE HOOKS ============
  ngOnInit(): void {
    const entityId = localStorage.getItem('selectedEntityId');
    if (entityId) {
      this.entity_id = entityId;
    }

    this.todayDate = new Date().toISOString().split('T')[0];
    this.currentTime = new Date().toLocaleTimeString();
    this.checkAttendanceMode();
    this.requestLocation();
  }

  ngOnDestroy(): void {
    this.stopWebcam();
  }

  // ============ GPS GEOLOCATION ============
  requestLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.latitude = pos.coords.latitude;
          this.longitude = pos.coords.longitude;
          this.accuracy = Math.round(pos.coords.accuracy);
          this.gpsAcquired = true;
          this.gpsStatus = `GPS Acquired (±${this.accuracy}m)`;
          this.cdr.detectChanges();
        },
        (err) => {
          this.gpsAcquired = false;
          this.gpsStatus = 'GPS unavailable: ' + err.message;
          console.warn('GPS error in face capture:', err.message);
          this.cdr.detectChanges();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      this.gpsStatus = 'Geolocation not supported';
    }
  }

  // ============ CHECK ATTENDANCE MODE ============
  checkAttendanceMode(): void {
    const currentTime = new Date();
    const hours = currentTime.getHours();

    if (hours >= 12 && hours < 22) {
      this.isInMode = false;
    } else {
      this.isInMode = true;
    }
  }

  // ============ MODAL CONTROLS ============
  openPhotoModal(): void {
    this.showPhotoModal = true;
    this.capturedImageUrl = null;
    this.photoModalError = '';
    this.isLoading = false;
    this.searchCompleted = false;
    this.attendanceResponse = null;
    this.employeeData = null;
    this.matchedEmployees = [];
    this.showListing = false;
    this.selectedEmployee = null;
    this.attendanceSummary = null;
    this.dateInfo = null;
    this.checkAttendanceMode();
    this.requestLocation();
    this.startWebcam();
  }

  closePhotoModal(): void {
    this.stopWebcam();
    this.showPhotoModal = false;
    this.webcamActive = false;
    this.capturedImageUrl = null;
    this.photoModalError = '';
    this.isLoading = false;
    this.searchCompleted = false;
    this.matchedEmployees = [];
    this.showListing = false;
  }

  // ============ WEBCAM ============
  startWebcam(): void {
    this.webcamActive = true;
    this.photoModalError = '';
    this.capturedImageUrl = null;
    this.isLoading = false;
    this.searchCompleted = false;
    this.matchedEmployees = [];
    this.showListing = false;

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    })
      .then((stream: MediaStream) => {
        this.webcamStream = stream;
        const video = document.getElementById('employeeWebcam') as HTMLVideoElement;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play()
              .then(() => {
                this.webcamActive = true;
                this.cdr.detectChanges();
              })
              .catch(e => {
                console.error('Video play error:', e);
                this.photoModalError = 'Failed to play video.';
                this.webcamActive = false;
                this.stopWebcam();
              });
          };
        } else {
          this.photoModalError = 'Camera not ready. Please try again.';
          this.webcamActive = false;
          this.stopWebcam();
        }
      })
      .catch((err) => {
        console.error('Camera error:', err);
        this.photoModalError = 'Camera permission denied. Please allow camera access in browser settings.';
        this.webcamActive = false;
      });
  }

  // ============ CAPTURE PHOTO ============
  captureFromWebcam(): void {
    const video = document.getElementById('employeeWebcam') as HTMLVideoElement;
    const canvas = document.getElementById('employeeCanvas') as HTMLCanvasElement;

    if (!video || !canvas) {
      this.photoModalError = 'Camera not ready. Please try again.';
      return;
    }

    if (video.readyState < 2 || video.videoWidth === 0) {
      this.photoModalError = 'Camera is not ready yet. Please wait.';
      return;
    }

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        this.photoModalError = 'Failed to capture. Please try again.';
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImageUrl = canvas.toDataURL('image/jpeg', 0.85);

      this.stopWebcam();
      this.webcamActive = false;
      this.cdr.detectChanges();

      this.verifyAndMarkAttendance();
    } catch (error) {
      console.error('Capture error:', error);
      this.photoModalError = 'Something went wrong during capture. Please try again.';
    }
  }

  // ============ VERIFY FACE & MARK ATTENDANCE ============
  verifyAndMarkAttendance(): void {
    if (!this.capturedImageUrl) {
      this.photoModalError = '❌ No image captured.';
      return;
    }

    this.isLoading = true;
    this.searchCompleted = false;
    this.photoModalError = '';
    this.matchedEmployees = [];
    this.showListing = false;
    this.cdr.detectChanges();

    const entryType = this.isInMode ? 'IN' : 'OUT';
    const payload = {
      entry_type: entryType,
      face_image_base64: this.capturedImageUrl,
      latitude: this.latitude,
      longitude: this.longitude,
      accuracy: this.accuracy,
      client_timestamp: new Date().toISOString()
    };

    this.attendanceService.verified_punch(payload)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.searchCompleted = true;

          if (response && (response.code === 200 || response.success)) {
            this.attendanceResponse = response;
            const empName = response.data?.user?.first_name 
              ? `${response.data.user.first_name} ${response.data.user.last_name || ''}`.trim()
              : (response.data?.employee_id ? `Employee #${response.data.employee_id}` : 'Verified Employee');

            const matchedEmp = {
              id: response.data?.employee_id,
              name: empName,
              code: response.data?.user?.employee_code || response.data?.employee_id,
              attendance_status: 'marked',
              entry_type: entryType,
              attendance_time: response.data?.server_timestamp || new Date().toLocaleTimeString(),
              match_score: response.data?.face?.match_score || 0.95,
              designation: response.data?.user?.designation_name || 'Staff'
            };

            this.selectedEmployee = matchedEmp;
            this.employeeData = matchedEmp;
            this.matchedEmployees = [matchedEmp];
            this.showListing = true;

            this.attendanceSummary = {
              total_matched: 1,
              marked: 1,
              updated: 0,
              already_marked: 0
            };

            this.dateInfo = {
              date: this.todayDate,
              entry_type: entryType,
              type: 'VERIFIED'
            };

            this.photoModalError = `✅ ${entryType} marked successfully! ${response.message || ''}`;
            this.attendanceStatus = 'marked';

            localStorage.setItem('lastAttendance', JSON.stringify({
              employees: this.matchedEmployees,
              entry_type: entryType,
              time: new Date().toLocaleTimeString(),
              date: this.todayDate
            }));
          } else {
            this.photoModalError = response.message || '❌ Face verification failed. Please try again.';
            this.showListing = false;
          }
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.isLoading = false;
          this.searchCompleted = true;
          this.showListing = false;

          const errorMsg = error.error?.message || error.message;
          if (error.status === 400) {
            this.photoModalError = `❌ ${errorMsg || 'Face or location verification failed.'}`;
          } else if (error.status === 401) {
            this.photoModalError = '❌ Unauthorized session. Please login again.';
          } else if (error.status === 403) {
            this.photoModalError = `❌ ${errorMsg || 'Access denied or employee inactive.'}`;
          } else {
            this.photoModalError = `❌ ${errorMsg || 'Failed to mark attendance. Please try again.'}`;
          }
          this.cdr.detectChanges();
        }
      });
  }

  // ============ SELECT EMPLOYEE FROM LIST ============
  selectEmployee(employee: any): void {
    this.selectedEmployee = employee;
    this.employeeData = employee;
    this.cdr.detectChanges();
  }

  // ============ CONFIRM PHOTO ============
  confirmPhoto(): void {
    if (this.capturedImageUrl) {
      this.photoPreview = this.capturedImageUrl;
    }
    this.closePhotoModal();
  }

  // ============ WEBCAM CONTROLS ============
  stopWebcam(): void {
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(t => t.stop());
      this.webcamStream = null;
    }
  }

  goBackFromWebcam(): void {
    this.stopWebcam();
    this.webcamActive = false;
    this.photoModalError = '';
  }

  resetPhotoSelection(): void {
    this.capturedImageUrl = null;
    this.photoModalError = '';
    this.webcamActive = false;
    this.isLoading = false;
    this.searchCompleted = false;
    this.attendanceResponse = null;
    this.employeeData = null;
    this.matchedEmployees = [];
    this.showListing = false;
    this.selectedEmployee = null;
    this.stopWebcam();
    this.startWebcam();
  }

  clearPhoto(): void {
    this.photoPreview = null;
    this.employeeData = null;
    this.attendanceResponse = null;
    this.attendanceStatus = '';
    this.matchedEmployees = [];
    this.showListing = false;
  }

  // ============ GET STATUS CLASS ============
  getStatusClass(status: string): string {
    switch (status) {
      case 'marked': return 'status-marked';
      case 'updated': return 'status-updated';
      case 'already_marked': return 'status-already';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }

  // ============ GET STATUS ICON ============
  getStatusIcon(status: string): string {
    switch (status) {
      case 'marked': return 'fa-solid fa-check-circle';
      case 'updated': return 'fa-solid fa-rotate';
      case 'already_marked': return 'fa-solid fa-clock';
      case 'failed': return 'fa-solid fa-times-circle';
      default: return 'fa-solid fa-circle';
    }
  }
}