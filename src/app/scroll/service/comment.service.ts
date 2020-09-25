import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Comment } from '../store/model';

@Injectable({providedIn: 'root'})
export class CommentService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<{ comments: Comment[]; }> {

    return this.http.get<{ comments: Comment[] }>('/api/comments/all');

  }

}
