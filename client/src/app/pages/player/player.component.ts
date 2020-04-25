import { Component } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { CloudService } from '../../services/cloud.service';
import { StreamState } from '../../interfaces/stream-state';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  files: Array<any> = [];
  artists: Array<any> = [];
  albums: Array<any> = [];
  songs: Array<any> = [];
  state: StreamState;
  currentFile: any = {};

  constructor(private audioService: AudioService, cloudService: CloudService, public auth: AuthService) {
    const HOST_NAME= 'http://musecan.admin.local.com/';
    const songFolder= 'uploads/songs/';
    // get media files
    cloudService.getFiles().subscribe(files => {
      this.files = files;
    });
    cloudService.getAllArtist().subscribe((data: any[]) => {
      this.artists = data;
      let newArtist = [];
      this.artists.forEach((val: any, key: any) => {
        newArtist[val.id] = val;
      });
      this.artists = newArtist;
      cloudService.getAllAlbums().subscribe((data: any[]) => {
        this.albums = data;
        let newAlbums = [];
        this.albums.forEach((val: any, key: any) => {
          newAlbums[val.id] = val;
        });
        this.albums = newAlbums;
        cloudService.getAllSongs().subscribe((data: any[]) => {
          this.songs = data;
          let newSong: Array<any> = [];
          this.songs.forEach((val: any, key: any) => {
            let albumId = val.albumSong.split('/');
            let artistName = '';
            this.albums[albumId[3]].artist.forEach((val2: any, key2: any) => {
              artistName += ' ' + this.artists[val2.split('/')[3]].name
            });
            let singleSong = {
              'url': HOST_NAME + songFolder + val.audio,
              'artist': artistName,
              'name': val.name
            };
            newSong.push(singleSong);
          });
          this.files = newSong;
        });
      });
    });
    // listen to stream state
    this.audioService.getState()
    .subscribe(state => {
      this.state = state;
    });
  }

  playStream(url) {
    this.audioService.playStream(url)
    .subscribe(events => {
      // listening for fun here
    });
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.audioService.stop();
    this.playStream(file.url);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }
}
