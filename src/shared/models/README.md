# API Response Interfaces

This documentation provides an overview of the interfaces used to handle API responses and entities in our Angular project.

## HttpDjangoResponse

`HttpDjangoResponse` is a general interface for backend responses that return only a status and a message. This interface is used across various services where the response structure is simple and consistent.

### Definition

```typescript
export interface HttpDjangoResponse {
  success: boolean;
  message: string;
}
```

#### Usage Example

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpDjangoResponse } from '../models/http-django-response.model';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private apiUrl = 'your-api-endpoint-url';

  constructor(private http: HttpClient) {}

  exampleMethod(): Observable<HttpDjangoResponse> {
    return this.http.get<HttpDjangoResponse>(`${this.apiUrl}/example-endpoint`);
  }
}
```
## Specific Response and Entity Interfaces

In addition to the general HttpDjangoResponse, there are specific interfaces for handling detailed responses and entities. These interfaces provide a structured way to manage the various data models and API responses within the application.

### Example: MembershipResponse

The MembershipResponse interface is used to handle responses that include detailed membership information.

#### Definition

```typescript
import { User } from './user.model';

export interface Membership {
  membership_id: number;
  start_date: string;
  end_date: string;
  user: User;
}

export interface MembershipResponse {
  success: boolean;
  memberships: Membership[];
}
```

#### Usage Example of 'MembershipResponse' interface

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MembershipResponse } from '../models/membership-response.model';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private apiUrl = 'your-api-endpoint-url';

  constructor(private http: HttpClient) {}

  getMemberships(): Observable<MembershipResponse> {
    return this.http.get<MembershipResponse>(this.apiUrl);
  }
}
```
# Entity Example

The User interface represents the structure of user data within the application.

```typescript
export interface User {
  uid: string;
  username: string;
  email: string;
  is_admin: boolean;
  program: string;
  student_code: number;
  phone: string;
  photo_url: string;
  student_code_edited: boolean;
  program_edited: boolean;
  phone_edited: boolean;
}
```

## General Interfaces: For common response structures used across multiple services, such as HttpDjangoResponse.

## Specific Interfaces: For detailed responses and entities specific to certain functionalities, like MembershipResponse and User.