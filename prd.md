# Virtual Property Tour System PRD

[TOC]

## Project Overview
The Virtual Property Tour System is a web-based platform enabling real-time video tours of properties through WebRTC technology. This system will be integrated with Hello Yaatri Digital Guidebook to provide potential guests with live, guided virtual property tours.

## Core Objectives
- Enable potential guests to schedule and participate in live video tours
- Allow property caretakers to conduct virtual property tours
- Maintain zero additional infrastructure costs
- Provide a seamless, browser-based experience without external apps

## Technical Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- WebRTC for peer-to-peer video streaming
- PeerJS library for WebRTC implementation
- Responsive design for mobile compatibility

### Backend
- Supabase for:
  - User authentication
  - Database
  - Real-time updates
  - File storage (if needed)

### Deployment
- GitHub for version control
- GitHub Pages for frontend hosting
- Cursor as the development IDE

## Functional Requirements

### 1. Landing Page

#### Features
- Property selection dropdown
- Guest information form
  - Name
  - Contact number
  - Email address
- Submit button
- Responsive design
- Loading states

#### Data Collection
- Property details
- Guest information
- Timestamp of request
- Status of request

### 2. Video Call System

#### Features
- Browser-based video streaming
- Audio toggle
- Video toggle
- End call button
- Connection status indicator
- Fallback mechanism for failed connections

#### Technical Requirements
- WebRTC implementation
- STUN server configuration
- Signaling mechanism through Supabase
- Bandwidth optimization
- Error handling

### 3. Caretaker Interface

#### Features
- Login system
- Tour request notifications
- Accept/Reject tour requests
- Start video call
- View guest details
- Tour history

### 4. Database Schema

#### Users Table
```sql
users (
  id uuid primary key,
  created_at timestamp,
  name text,
  contact_number text,
  email text
)
```

#### Properties Table
```sql
properties (
  id uuid primary key,
  name text,
  description text,
  caretaker_id uuid references users(id)
)
```

#### Tour_Requests Table
```sql
tour_requests (
  id uuid primary key,
  created_at timestamp,
  guest_id uuid references users(id),
  property_id uuid references properties(id),
  status text,
  scheduled_time timestamp,
  call_id text
)
```

## User Flows

### Guest Flow
1. Guest visits landing page
2. Selects property from dropdown
3. Fills in personal details
4. Submits tour request
5. Receives confirmation
6. Joins video call at scheduled time
7. Participates in tour
8. Ends call

### Caretaker Flow
1. Logs into system
2. Views pending tour requests
3. Accepts/Rejects requests
4. Initiates video call at scheduled time
5. Conducts tour
6. Ends call

## Implementation Phases

### Phase 1: Basic Setup
- Repository setup
- Frontend scaffolding
- Supabase integration
- Basic styling

### Phase 2: Form Implementation
- Landing page development
- Form validation
- Database integration
- Error handling

### Phase 3: Video System
- WebRTC implementation
- PeerJS integration
- Video controls
- Connection handling

### Phase 4: Caretaker Portal
- Authentication
- Tour management
- Notification system

### Phase 5: Testing & Deployment
- Cross-browser testing
- Mobile testing
- Performance optimization
- GitHub Pages deployment

## Performance Requirements
- Page load time < 3 seconds
- Video latency < 500ms
- 99.9% connection success rate
- Support for latest versions of Chrome, Firefox, Safari

## Security Requirements
- Secure WebRTC connections
- Input sanitization
- XSS prevention
- CORS configuration
- Rate limiting

## Future Considerations
- Screen sharing capability
- Chat feature
- Recording tours
- Multiple caretaker support
- Analytics dashboard
- Automated scheduling system

## Success Metrics
- Tour completion rate
- Connection success rate
- User satisfaction score
- System uptime
- Average tour duration

## Project Constraints
- Zero additional infrastructure costs
- Browser compatibility
- Internet bandwidth requirements
- Mobile device support

## Testing Strategy
- Unit testing for core functions
- Integration testing for API endpoints
- End-to-end testing for user flows
- Cross-browser compatibility testing
- Mobile responsiveness testing