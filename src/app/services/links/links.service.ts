import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, Link, LinkData } from '../../models/link.interface';
import { link } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  private readonly API_URL = 'https://biolink-api-835852425105.us-central1.run.app'
  private http = inject(HttpClient)
  private token: string | null = '';
  constructor() {
    this.token = localStorage.getItem('token');
  }

  getLinks() {
    const username = localStorage.getItem('username') || '{}';
    return this.http.get<Link[]>(`${this.API_URL}/users/${username}/links`)
  }

  createLink(linkData: LinkData) {
    const headers = new HttpHeaders({
      Authorization: `bearer ${this.token}`
    });
    return this.http.post<Link>(`${this.API_URL}/links/`, linkData, { headers })
  }

  updateLink(id: string, data: LinkData) {
    const headers = new HttpHeaders({
      Authorization: `bearer ${this.token}`
    });
    return this.http.put<Link>(`${this.API_URL}/links/${id}`, data, { headers });
  }

  deleteLink(linkId: string) {
    const headers = new HttpHeaders({
      Authorization: `bearer ${this.token}`
    });
    return this.http.delete<any>(`${this.API_URL}/links/${linkId}`, { headers })
  }

  updateLinksOrder(links: Link[]) {
    const headers = new HttpHeaders({
      Authorization: `bearer ${this.token}`
    });
    const linksOrder = links.map((link, index) => ({
      id: link.id,
      order: index
    }));
    return this.http.put<ApiResponse<Link[]>>(`${this.API_URL}/links/bulk/reorder`, linksOrder, { headers });
  }

  getPublicLinks(username:string){
    return this.http.get<ApiResponse<Link[]>>(`${this.API_URL}/users/${username}/links`)
  }

    /**
   * Incrementa el contador de clicks de un link
   */
  incrementClick(linkId: string){
    return this.http.post<ApiResponse<Link>>(`/links/${linkId}/click`, {});
  }
}
