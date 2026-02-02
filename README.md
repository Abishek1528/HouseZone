# HouseZone 🏠

**HouseZone** is a comprehensive multi-category platform for listing and managing various types of properties and assets including Residential, Business, Vehicles, and Machinery. The app allows users to register, choose their role (Tenant or Owner), and list or browse items within their selected category.

The platform is designed to make asset listing and discovery simple, organized, and accessible for everyone. Users can browse different categories, and owners can list their properties or assets with detailed information.

<p align="center">
  <img src="./MyHouseApp/assets/icon.png" alt="HouseZone Logo" width="200" />
</p>

## 🚀 Key Features

### Multi-Category Support

Users can choose from four main categories:

- **Residential** 🏠: Houses and apartments for rent/sale
- **Business** 🏢: Commercial properties and business spaces
- **Vehicles** 🚗: Cars, bikes, and other vehicles
- **Machinery** 🛠️: Industrial equipment and machinery

### Role-Based Access

- **Tenant**: Browse and view listings
- **Owner**: Create and manage listings

### Advanced Features

- Multi-step listing forms with detailed property information
- Image upload capabilities
- Location-based services
- Admin dashboard for management
- Secure authentication system
- RESTful API architecture

## 🛠️ Tech Stack

### Frontend

- **React Native** - Cross-platform mobile application framework
- **React Navigation** - Screen navigation and routing
- **Expo** - Development toolchain and platform
- **React Native Vector Icons** - Icon library
- **React Native Image Picker** - Media selection

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MySQL** - Relational database management
- **Multer** - File upload middleware
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database

- **MySQL** - Primary database for data storage
- **RESTful API** - Communication between frontend and backend

## 📁 Project Structure

```
HouseZone/
├── MyHouseApp/                 # Main application directory
│   ├── backend/               # Backend server
│   │   ├── config/           # Database configuration
│   │   ├── middleware/       # Custom middleware
│   │   ├── routes/           # API route definitions
│   │   ├── uploads/          # Uploaded files storage
│   │   ├── .env              # Backend environment variables
│   │   ├── package.json      # Backend dependencies
│   │   ├── server.js         # Main server file
│   │   └── setup.sql         # Database schema
│   ├── src/                  # Frontend source code
│   │   ├── components/       # Reusable UI components
│   │   ├── navigation/       # Navigation configuration
│   │   ├── screens/          # Application screens
│   │   │   ├── admin/        # Admin panel screens
│   │   │   ├── business/     # Business category screens
│   │   │   ├── machinery/    # Machinery category screens
│   │   │   ├── residential/  # Residential category screens
│   │   │   ├── vehicles/     # Vehicles category screens
│   │   │   └── shared/       # Shared components
│   │   └── styles/           # Styling files
│   ├── assets/               # Application assets
│   ├── .env                  # Frontend environment variables
│   ├── App.js                # Main application component
│   ├── app.json              # Expo configuration
│   ├── package.json          # Frontend dependencies
│   └── IP_CONFIGURATION_GUIDE.txt  # IP setup guide
└── README.md                 # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MySQL** database server
- **Expo CLI** (for React Native development)
- **Android Studio** or **Xcode** (for mobile development)

## 🚀 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/housezone.git
cd HouseZone
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd MyHouseApp/backend

# Install backend dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# DB_HOST=localhost
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_NAME=cdmrental
# PORT=3000
```

### 3. Database Setup

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE cdmrental;

# Import database schema (optional - tables are created via setup.sql)
mysql -u root -p cdmrental < setup.sql
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../

# Install frontend dependencies
npm install

# Install Expo CLI globally (if not already installed)
npm install -g expo-cli

# Create environment file
cp .env.example .env

# Edit .env file with your API URL
# EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### 5. Start Development Servers

**Backend Server:**
```bash
# From MyHouseApp/backend directory
npm run dev
# or
npm start
```

**Frontend Application:**
```bash
# From MyHouseApp directory
npm start
# or for specific platforms
npm run android
npm run ios
npm run web
```

## 🎯 Usage

### Running the Application

1. **Start the Backend Server**
   - Navigate to `MyHouseApp/backend`
   - Run `npm start` or `npm run dev`
   - Server will start on `http://localhost:3000`

2. **Start the Frontend Application**
   - Navigate to `MyHouseApp`
   - Run `npm start`
   - Scan QR code with Expo Go app or use emulator

### Configuration

#### IP Address Configuration

To configure IP addresses for network access:

1. **Backend IP**: Update `backend/.env` file
   ```env
   DB_HOST=your_mysql_server_ip
   PORT=3000
   ```

2. **Frontend API URL**: Update `MyHouseApp/.env` file
   ```env
   EXPO_PUBLIC_API_URL=http://your_backend_ip:3000/api
   ```

3. **Mobile App API**: Update `src/screens/residential/logic/api.js`
   ```javascript
   const API_BASE_URL = 'http://your_backend_ip:3000/api';
   ```

### User Roles

**Tenant Features:**
- Browse property listings
- View detailed property information
- Search by category and filters
- Contact property owners

**Owner Features:**
- Create new listings
- Manage existing listings
- Upload property images
- Set rental terms and pricing

**Admin Features:**
- User management
- Property listing moderation
- System configuration
- Analytics dashboard

## 📸 Screenshots / Demo

*Coming soon - Visual demonstration of the application interface*

### Key Screens

- **Home Screen**: Category selection and featured listings
- **Login/Signup**: User authentication
- **Property Listings**: Grid and list views
- **Property Details**: Comprehensive property information
- **Add Listing**: Multi-step form for new listings
- **Admin Dashboard**: Management interface

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### User Signup
```
POST /api/signup
Content-Type: application/json

{
  "name": "John Doe",
  "age": 25,
  "contact": "1234567890",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### User Login
```
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Residential Property Endpoints

#### Step 1: Basic Property Details
```
POST /api/residential/step1
Content-Type: application/json

{
  "ownerName": "John Doe",
  "doorNumber": 123,
  "street": "Main Street",
  "area": "Downtown",
  "pincode": 123456,
  "city": "Sample City",
  "phoneNumber": "1234567890"
}
```

#### Step 2: Property Specifications
```
POST /api/residential/step2
Content-Type: application/json

{
  "roNo": 1,
  "facingDirection": "North",
  "hallLength": 15.5,
  "hallBreadth": 12.0,
  "numberOfBedrooms": 3,
  "kitchenLength": 10.0,
  "kitchenBreadth": 8.0,
  "numberOfBathrooms": 2,
  "bathroomTypes": ["Attached", "Common"],
  "floorNumber": 2,
  "parking2Wheeler": true,
  "parking4Wheeler": true
}
```

#### Step 3: Payment and Images
```
POST /api/residential/step3
Content-Type: multipart/form-data

FormData with:
- advanceAmount: 50000
- monthlyRent: 15000
- leaseAmount: 180000
- images: [file1.jpg, file2.jpg, file3.jpg]
```

### Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🔧 Environment Variables

### Backend (.env)

```env
DB_HOST=localhost          # MySQL server host
DB_USER=root              # Database username
DB_PASSWORD=your_password # Database password
DB_NAME=cdmrental         # Database name
PORT=3000                 # Server port
```

### Frontend (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api  # Backend API URL
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author / Credits

**Project Lead:** [Your Name]

### Development Team

- **Frontend Development**: React Native implementation
- **Backend Development**: Node.js/Express API
- **Database Design**: MySQL schema architecture
- **UI/UX Design**: Mobile-first interface design

### Special Thanks

- React Native Community
- Expo Team
- MySQL Community
- Open Source Contributors

### Contact

For questions, suggestions, or support:

- **Email**: your.email@example.com
- **GitHub**: [your-username](https://github.com/your-username)

## 🆘 Troubleshooting

### Common Issues

**1. Database Connection Failed**
- Verify MySQL server is running
- Check database credentials in `.env` file
- Ensure database `cdmrental` exists

**2. API Connection Issues**
- Verify backend server is running on correct port
- Check IP configuration in frontend files
- Ensure CORS is properly configured

**3. Image Upload Failures**
- Verify `uploads` directory exists in backend
- Check file permissions
- Ensure proper multipart/form-data handling

**4. Mobile App Not Loading**
- Restart Expo development server
- Clear Expo cache: `expo start -c`
- Check network connectivity

### Getting Help

1. Check the [IP_CONFIGURATION_GUIDE.txt](MyHouseApp/IP_CONFIGURATION_GUIDE.txt) for network setup
2. Review the console logs for detailed error messages
3. Ensure all prerequisites are installed correctly
4. Verify environment variables are properly configured

---

<p align="center">
  Made with ❤️ for property management
</p>