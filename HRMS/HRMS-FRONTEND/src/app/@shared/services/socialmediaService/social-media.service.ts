import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, take, tap, catchError } from 'rxjs';
import { environment } from 'src/app/environments/environment';

export interface SocialCredetials {
  CLIENT_ID?: string,
  CLIENT_SECRET?: string,
  WORK_PLATFORM_ID?: string,
  EXTERNAL_ID?: string,
  USER_ID?: string,
  ACCOUNT_ID?: string,
  PROFILE_ID?: string,
  CONTENT_ID?: string
}
const MAX_CACHE_SIZE = 50;
@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {
  private INQ_API = `${environment.INQ_API}/v1`;
  private BASE_API = `${environment.serverUrl}/api/v1`;

  private socialCredetials: SocialCredetials = {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    WORK_PLATFORM_ID: '',
    EXTERNAL_ID: '',
    USER_ID: '',
    ACCOUNT_ID: '',
    PROFILE_ID: '',
    CONTENT_ID: ''
  }
  private $socialCredetialsSub: BehaviorSubject<SocialCredetials> = new BehaviorSubject(this.socialCredetials)
  private userProfileSub$: BehaviorSubject<any> = new BehaviorSubject(null);
  private socialPlatforms: {[key:string]:{name:string, id: string, logo_url: string}} = {
    "TikTok": {
      "name": "TikTok",
      "id": "de55aeec-0dc8-4119-bf90-16b3d1f0c987",
      "logo_url": "https://cdn.getphyllo.com/platforms_logo/logos/logo_tiktok.png"
    },
    "Instagram": {
      "name": "Instagram",
      "id": "9bb8913b-ddd9-430b-a66a-d74d846e6c66",
      "logo_url": "https://cdn.getphyllo.com/platforms_logo/logos/logo_instagram.png"
    },
    "YouTube": {
      "name": "YouTube",
      "id": "14d9ddf5-51c6-415e-bde6-f8ed36ad7054",
      "logo_url": "https://cdn.getphyllo.com/platforms_logo/logos/logo_youtube.png"
    },
    "X": {
      "name": "X",
      "id": "7645460a-96e0-4192-a3ce-a1fc30641f72",
      "logo_url": "https://cdn.getphyllo.com/platforms_logo/logos/logo_x.png"
    },
    "Twitch": {
      "name": "Twitch",
      "id": "e4de6c01-5b78-4fc0-a651-24f44134457b",
      "logo_url": "https://cdn.getphyllo.com/platforms_logo/logos/logo_twitch.png"
    },
    "Facebook": {
      "name": "Facebook",
      "id": "ad2fec62-2987-40a0-89fb-23485972598c",
      "logo_url": "https://cdn.getphyllo.com/platforms_logo/logos/logo_facebook.png"
    },
    "Substack": {
      "name": "Substack",
      "id": "fbf76083-710b-439a-8b8c-956f607ef2c1",
      "logo_url": "https://cdn.getphyllo.com/platforms_logo/logos/logo_substack.png"
    },
    "Snapchat": {
      "name": "Snapchat",
      "id": "ee3c8d7a-3207-4f56-945f-f942b34c96e1",
      "logo_url": "https://cdn.getphyllo.com/platforms_logo/logos/logo_snapchat.png"
    },
    "Instagram Direct": {
      "name": "Instagram Direct",
      "id": "d3badb09-a81f-4444-bc27-1a994d939e00",
      "logo_url": "https://cdn.getphyllo.com/platforms_logo/logos/logo_instagram_direct.png"
    },
    "Instagram Lite": {
      "name": "Instagram Lite",
      "id": "fb7cafcf-60ed-468a-ad6d-6bb6899d0871",
      "logo_url": "https://cdn.getphyllo.com/platforms_logo/logos/logo_instagram_lite.png"
    }
  }

  constructor(private http: HttpClient) { }

  get socialCreds() {
    return this.$socialCredetialsSub.getValue();
  }
  getSocialCredentials(): Observable<SocialCredetials> {
    return this.$socialCredetialsSub.asObservable()
  }
  updateSocialCredentials(updateFields: SocialCredetials) {
    Object.keys(updateFields).forEach((key: string) => {
      this.socialCredetials[key as keyof SocialCredetials] = updateFields[key as keyof SocialCredetials]
    })
    this.$socialCredetialsSub.next(this.socialCredetials)
  }
  getMyPlateform(plateform: string) {
    return this.socialPlatforms[plateform] || null
  }

  getSocialPlateforms(params?: any): Observable<any> {
    return this.http.get(`${this.INQ_API}/work-platforms`, { params })
  }

  getSocialPlatformById(platform_id: string): Observable<any> {
    return this.http.get(`${this.INQ_API}/work-platforms/${platform_id}`)
  }
  getSocialUsers(params?: any): Observable<any> {
    return this.http.get(`${this.INQ_API}/users`, { params })
  }

  getSocialUserById(user_id: string): Observable<any> {
    return this.http.get(`${this.INQ_API}/users/${user_id}`)
  }

  getPlatformAccounts(params?: any): Observable<any> {
    return this.http.get(`${this.INQ_API}/accounts`, { params })
  }
  autheriseToken(body: {}) {
    return this.http.post(`${this.INQ_API}/accounts`, body)
  }
  getAccountProfiles(params: any): Observable<any> {
    return this.http.get(`${this.INQ_API}/profiles`, { params }).pipe(
      catchError((error:any) => {
        console.error('Error fetching profiles:', error);
        throw error; // or return a default value
      })
    )
  }
  // storageApis/ observables single source
  private userProfileObs$ = this.userProfileSub$.asObservable();
  getAccountProfilesData(params: any): Observable<any[]> {
    return this.userProfileSub$.pipe(
      switchMap((cachedProfile: UserProfile | null) => {
        if (!cachedProfile) {
          return this.getAccountProfiles(params).pipe(
            tap((res: UserProfile) => this.userProfileSub$.next(res)),
            take(1)
          );
        }
        return of(this.userProfileSub$.value); // Assuming you want to return data.data
      })
    );
  }
  clearProfileCacheSingel() {
    this.userProfileSub$.next(null);
  }

  //multiple accounts cache
  private userProfilesCache$ = new Map<string, BehaviorSubject<UserProfile | null>>();
  setProfileCache(accountId: string, profile: UserProfile): void {
    if (this.userProfilesCache$.size >= MAX_CACHE_SIZE) {
      const firstKey = this.userProfilesCache$.keys().next().value;
      if (firstKey) {
        this.userProfilesCache$.delete(firstKey); // Remove the oldest
      }
    }
    this.userProfilesCache$.set(accountId, new BehaviorSubject<UserProfile | null>(null));
  }
  getAccountProfilesDataById(accountId: string, params: any): Observable<UserProfile> {
    // Create or retrieve the BehaviorSubject for this account
    if (!this.userProfilesCache$.has(accountId)) {
      this.setProfileCache(accountId, {} as UserProfile); // Initialize with an empty profile
      // this.userProfilesCache$.set(accountId, new BehaviorSubject<UserProfile | null>(null));
    }

    const profileSubject = this.userProfilesCache$.get(accountId)!;

    return profileSubject.pipe(
      switchMap((cachedProfile: UserProfile | null) => {
        if (cachedProfile) {
          return of(cachedProfile);
        } else {
          return this.getAccountProfiles(params).pipe(
            tap((profile: UserProfile) => profileSubject.next(profile))
          );
        }
      }),
      take(1)
    );
  }

  // Optional: Clear cache for a specific account
  clearProfileCache(accountId: string): void {
    this.userProfilesCache$.delete(accountId);
  }

  // Optional: Clear all cached profiles
  clearAllProfileCache(): void {
    this.userProfilesCache$.clear();
  }


  getAccountProfile(profile_id: string): Observable<any> {
    return this.http.get(`${this.INQ_API}/profiles/${profile_id}`)
  }

  getProfileContents(params: any): Observable<any> {
    return this.http.get(`${this.INQ_API}/social/contents`, { params })
  }
  getProfileContentById(contentId:string, params?: any): Observable<any> {
    return this.http.get(`${this.BASE_API}/social-media/profiles/contents/${contentId}`, { params })
  }
  getPublicContent(body: { profile_url: string, work_platform_id: string, content_type: string }): Observable<any> {
    return this.http.post(`${this.INQ_API}/social/creators/contents/fetch`, body)
  }
  getCreatorProfileAnalytics(body: { identifier: string, work_platform_id: string }): Observable<any> {
    return this.http.post(`${this.INQ_API}/social/creators/profiles/analytics`, body)
  }
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  profile_url: string;
  work_platform_id: string;
  work_platform_name: string;
  work_platform_logo_url: string;
  account_id: string;
  account_name: string;
  account_logo_url: string;
  account_type: string;
  account_type_name: string;
  account_type_logo_url: string;
  created_at: Date;
  updated_at: Date;
}
