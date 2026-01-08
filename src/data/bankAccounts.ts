export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  upiId: string;
  qrCodeUrl: string;
  isActive: boolean;
}

export const bankAccounts: BankAccount[] = [
  {
    id: 'union-bank',
    bankName: 'Union Bank of India',
    accountNumber: '011010100154520',
    ifscCode: 'UBIN0801101',
    accountHolderName: 'UPADRASTA P HARSHA VARDHAN',
    upiId: 'upadrastaharsha09@ybl',
    qrCodeUrl: '/src/qrimages/unionbank.jpeg',
    isActive: true
  },
  {
    id: 'bob',
    bankName: 'Bank of Baroda',
    accountNumber: '09730100022908',
    ifscCode: 'BARB0RAMACH',
    accountHolderName: 'UPADRASTA P HARSHA VARDHAN',
    upiId: '8008363854@ybl',
    qrCodeUrl: '/src/qrimages/Bob.jpeg',
    isActive: true
  },
  {
    id: 'csb',
    bankName: 'Catholic Syrian Bank',
    accountNumber: '072407689535190001',
    ifscCode: 'CSBK0000724',
    accountHolderName: 'UPADRASTA P HARSHA VARDHAN',
    upiId: 'harshaupadrasta1@ybl',
    qrCodeUrl: '/src/qrimages/csb.jpeg',
    isActive: true
  },
  {
    id: 'hdfc',
    bankName: 'HDFC Bank',
    accountNumber: '50100569605173',
    ifscCode: 'HDFC0002975',
    accountHolderName: 'UPADRASTA P HARSHA VARDHAN',
    upiId: 'upadrastaharsha08@ybl',
    qrCodeUrl: '/src/qrimages/Hdfc.jpeg',
    isActive: true
  },
  {
    id: 'kotak',
    bankName: 'Kotak Mahindra Bank',
    accountNumber: '5613258619',
    ifscCode: 'KKBK0007878',
    accountHolderName: 'UPADRASTA P HARSHA VARDHAN',
    upiId: 'harsha.upadrasta@ybl',
    qrCodeUrl: '/src/qrimages/Kotak.jpeg',
    isActive: true
  },
  {
    id: 'canara',
    bankName: 'Canara Bank',
    accountNumber: '32572250022498',
    ifscCode: 'CNRB0000033',
    accountHolderName: 'UPADRASTA P HARSHA VARDHAN',
    upiId: '8008363854-4@ybl',
    qrCodeUrl: '/src/qrimages/Canara.jpeg',
    isActive: true
  }
];