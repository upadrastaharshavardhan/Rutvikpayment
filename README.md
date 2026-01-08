# RUTVIK NRI Services

A comprehensive platform for online and offline pooja services, connecting devotees with experienced priests and astrologers worldwide.

## Features

- **Online Pooja Booking**: Book virtual ceremonies with experienced priests
- **Offline Services**: Schedule in-person poojas and consultations
- **Multiple Payment Options**: QR/UPI payments and secure gateway integration
- **Admin Dashboard**: Comprehensive booking and payment management
- **Custom Requests**: Request personalized ceremonies
- **Muhurtham Services**: Expert astrological consultations

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Payments**: Multiple UPI/QR options + Razorpay integration
- **Icons**: Lucide React
- **Deployment**: Netlify ready

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_ADMIN_UID=your_admin_user_id

# Twilio Configuration (for SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Gmail Configuration (for email notifications)
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password

# Razorpay Configuration (optional)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd rutvik-nri-services
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase, Twilio, and Gmail credentials

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Deployment to Netlify

### Option 1: Direct Deployment
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

### Option 2: Git Integration
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

### Option 3: Netlify CLI
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod --dir=dist`

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password and Google)
3. Create Firestore database
4. Set up security rules (see `firestore.rules`)
5. Enable Cloud Functions for email notifications

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── context/            # React context providers
├── services/           # API and business logic
├── types/              # TypeScript type definitions
├── data/               # Static data and configurations
├── lib/                # Utility libraries
└── utils/              # Helper functions
```

## Key Features

### Authentication
- Email/Password login
- Google OAuth integration
- Admin role management
- Profile completion flow

### Booking System
- Online pooja scheduling
- Offline service requests
- Custom ceremony requests
- Status tracking and management

### Payment Integration
- Multiple bank QR/UPI options
- Razorpay gateway integration
- Payment verification system
- Admin payment management

### Admin Dashboard
- Booking management
- Payment verification
- User management
- Analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and queries:
- Email: contactrutvikservices@gmail.com
- Phone: +91 7993924499

## License

This project is proprietary software owned by RUTVIK Services.