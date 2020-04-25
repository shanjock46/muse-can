import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CloudService {
  private songs: any[];
  private albums: any[];
  private artists: any[];
  constructor(private httpClient: HttpClient ) { }
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'accept': 'application/json' }) };
  HOST_NAME = 'http://musecan.admin.local.com/api/';
  files: any = [
// tslint:disable-next-line: max-line-length
    { url: 'https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3', 
      name: 'Perfect',
      artist: ' Ed Sheeran'
    },
    {
// tslint:disable-next-line: max-line-length
      url: 'https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3',
      name: 'Man Atkeya Beparwah',
      artist: 'Nusrat Fateh Ali Khan'
    },
    { url: 'https://ia801503.us.archive.org/15/items/TheBeatlesPennyLane_201805/The%20Beatles%20-%20Penny%20Lane.mp3',
      name: 'Penny Lane',
      artist: 'The Beatles'
    }
  ];

  getFiles() {
    this.getAllArtist().subscribe((data: any[])=>{
      this.artists = data;
    });
    this.getAllAlbums().subscribe((data: any[])=>{
      this.albums = data;
    });
    this.getAllSongs().subscribe((data: any[])=>{
      this.songs = data;
    });
   return of(this.files);
  }

  getAllArtist(){
    return this.httpClient.get(this.HOST_NAME + `artists`, this.httpOptions );
  }

  getAllAlbums(){
    return this.httpClient.get(this.HOST_NAME + `albums`, this.httpOptions );
  }
  getAllSongs(){
    return this.httpClient.get(this.HOST_NAME + `songs`, this.httpOptions );
  }
}
