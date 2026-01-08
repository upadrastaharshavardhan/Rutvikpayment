import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db, auth, isAdmin, ensureAuthenticated } from '../lib/firebase';
import { CustomRequest } from '../types/customRequest';

export async function createCustomRequest(data: Omit<CustomRequest, 'id' | 'userId' | 'status' | 'createdAt'>) {
  const user = ensureAuthenticated();
  
  const customRequest = {
    ...data,
    userId: user.uid,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'customRequests'), customRequest);
  return docRef.id;
}

export async function fetchUserCustomRequests(): Promise<CustomRequest[]> {
  const user = ensureAuthenticated();
  
  const q = query(
    collection(db, 'customRequests'),
    where('userId', '==', user.uid)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as CustomRequest[];
}

export async function fetchAllCustomRequests(): Promise<CustomRequest[]> {
  if (!isAdmin()) {
    throw new Error('Unauthorized access');
  }

  const querySnapshot = await getDocs(collection(db, 'customRequests'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as CustomRequest[];
}

export async function updateCustomRequestStatus(
  requestId: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string
) {
  if (!isAdmin()) {
    throw new Error('Unauthorized access');
  }

  const requestRef = doc(db, 'customRequests', requestId);
  const updateData: Record<string, any> = { status };
  
  if (rejectionReason) {
    updateData.rejectionReason = rejectionReason;
  }
  
  await updateDoc(requestRef, updateData);
}