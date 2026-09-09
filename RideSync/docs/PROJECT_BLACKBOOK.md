# 📚 RideSync - Academic Project Documentation (Blackbook)

**Project Title**: RideSync: Real-Time Biker Group Ride Tracking System  
**Author**: Harshal Sane  
**Institution**: Thakur College of Engineering & Technology (TCET), Mumbai  
**Department**: Information Technology (B.E. IT)  
**Technology Stack**: MERN Stack (MongoDB, Express.js, React.js, Node.js), Socket.IO, Leaflet JS, JWT  

---

## 1. System Architecture Overview

RideSync follows a micro-decoupled **Client-Server Architecture** featuring a single-page React frontend, a RESTful Node/Express backend, MongoDB persistence, and an event-driven Socket.IO real-time communication pipeline.

```mermaid
graph TD
    ClientLeader[Leader Web Client] -->|REST API Requests| ExpressServer[Express.js REST API Server]
    ClientFollower[Follower Web Client] -->|REST API Requests| ExpressServer
    ExpressServer -->|Read/Write Operations| MongoDB[(MongoDB Database)]
    
    ClientLeader <-->|WebSocket Bi-directional Stream| SocketServer[Socket.IO Telemetry Engine]
    ClientFollower <-->|WebSocket Bi-directional Stream| SocketServer
    
    SocketServer -->|Broadcast Location & Off-Route Alerts| ClientFollower
    SocketServer -->|Broadcast SOS & Join/Leave Events| ClientLeader
```

---

## 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ RIDE : creates
    USER ||--o{ RIDE_PARTICIPANT : joins
    RIDE ||--o{ RIDE_PARTICIPANT : includes
    RIDE ||--o{ LOCATION_LOG : records

    USER {
        string _id PK
        string name
        string email
        string passwordHash
        string role "rider | admin"
        boolean isBlocked
        date createdAt
    }

    RIDE {
        string _id PK
        string rideCode UK "8-char code"
        string title
        string leaderId FK
        object source
        object destination
        array routeCoordinates
        string status "scheduled | active | completed"
        date startTime
        date endTime
        number totalDistanceKm
    }

    RIDE_PARTICIPANT {
        string _id PK
        string rideId FK
        string userId FK
        string status "active | left | finished"
        date joinedAt
    }

    LOCATION_LOG {
        string _id PK
        string rideId FK
        string userId FK
        number latitude
        number longitude
        number speed
        number heading
        boolean isOffRoute
        date timestamp
    }
```

---

## 3. Data Flow Diagrams (DFD)

### DFD Level 0 (Context Diagram)

```mermaid
graph LR
    Rider((Rider / Leader / Follower)) <-->|Auth Details, Ride Codes, GPS Telemetry| RideSyncSystem[RideSync System]
    Admin((Admin User)) <-->|User Management, Platform Analytics| RideSyncSystem
```

### DFD Level 1

```mermaid
graph TD
    User((User)) -->|1. Register/Login| P1[Auth System]
    P1 -->|JWT Token| User
    
    User -->|2. Create Ride| P2[Ride Management]
    P2 -->|Generates Ride Code| DB[(MongoDB)]
    
    User -->|3. Join Ride with Code| P2
    P2 -->|Active Ride Session| P3[Socket Telemetry Engine]
    
    P3 <-->|4. GPS Coordinates Broadcast| SocketWS((WebSocket Stream))
    P3 -->|5. Check Off-Route Deviation| P4[Off-Route Detector]
    P4 -->|Alert Trigger| User

    Admin((Admin)) -->|6. Platform Analytics & Block User| P5[Admin Control Panel]
    P5 <--> DB
```

---

## 4. Use Case Diagram

```mermaid
graph LR
    subgraph RideSync Platform
        UC1[Register & Authenticate]
        UC2[Create Ride Session]
        UC3[Join Ride via 8-Char Code]
        UC4[Broadcast Live GPS Location]
        UC5[View Heads-Up Map Telemetry]
        UC6[Receive Off-Route Alerts]
        UC7[Broadcast Emergency SOS]
        UC8[View Completed Ride History]
        UC9[Manage Users & Platform Stats]
    end

    Rider Leader --> UC1
    Rider Leader --> UC2
    Rider Leader --> UC4
    Rider Leader --> UC5
    Rider Leader --> UC7
    Rider Leader --> UC8

    Follower Rider --> UC1
    Follower Rider --> UC3
    Follower Rider --> UC4
    Follower Rider --> UC5
    Follower Rider --> UC6
    Follower Rider --> UC7
    Follower Rider --> UC8

    Admin User --> UC1
    Admin User --> UC9
```

---

## 5. Sequence Diagram (Live Ride & Location Broadcast)

```mermaid
sequenceDiagram
    autonumber
    actor Leader
    actor Follower
    participant ClientApp as React Frontend
    participant Server as Socket.IO Backend
    participant GeoUtil as Haversine Engine

    Leader->>ClientApp: Start Ride (Generate Code)
    ClientApp->>Server: join_ride { rideCode, role: 'leader' }
    Server-->>ClientApp: Room Joined (Success)

    Follower->>ClientApp: Join Ride (Enter Code)
    ClientApp->>Server: join_ride { rideCode, role: 'follower' }
    Server-->>Leader: follower_joined { followerName }

    loop Every 1 Second GPS Broadcast
        Follower->>Server: update_location { lat, lng, speed, heading }
        Server->>GeoUtil: checkOffRoute(followerLoc, routePolyline)
        GeoUtil-->>Server: { isOffRoute: true, distanceMeters: 145 }
        Server-->>Follower: off_route_warning { distance: 145 }
        Server-->>Leader: follower_off_route { followerId, distance: 145 }
        Server-->>Leader: location_updated { followerId, lat, lng }
    end
```

---

## 6. Class Diagram

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String passwordHash
        +String role
        +Boolean isBlocked
        +register()
        +login()
    }

    class Ride {
        +String id
        +String rideCode
        +String title
        +String leaderId
        +Location source
        +Location destination
        +Array routeCoordinates
        +String status
        +createRide()
        +joinRide()
        +endRide()
    }

    class TelemetryEngine {
        +Socket socket
        +broadcastLocation(coords)
        +calculateDistance(p1, p2)
        +detectOffRoute(current, polyline)
    }

    class AdminService {
        +getPlatformStats()
        +toggleBlockUser(userId)
        +deleteUser(userId)
    }

    User "1" -- "0..*" Ride : creates
    Ride "1" -- "0..*" TelemetryEngine : tracks
    User "1" -- "0..*" TelemetryEngine : broadcasts
    User "1" -- "0..*" AdminService : managed_by
```

---

## 7. Mathematical Model: Haversine & Off-Route Distance Formula

To determine real-time off-route deviation between follower GPS point $P(lat_p, lng_p)$ and route line segment $AB$ between waypoint vertices $A(lat_a, lng_a)$ and $B(lat_b, lng_b)$, the Haversine formula is used to derive surface distance $d$:

$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1) \cdot \cos(\phi_2) \cdot \sin^2\left(\frac{\Delta \lambda}{2}\right)$$

$$c = 2 \cdot \operatorname{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$

$$d = R \cdot c$$

where $R = 6371000\text{ meters}$ (Earth radius), $\phi$ is latitude in radians, and $\lambda$ is longitude in radians. If $d > 100\text{ meters}$, an off-route alert event is dispatched via Socket.IO.
