import React, { useState, useEffect } from 'react';
import { User, UserRole, PaymentRequest, SubscriptionStatus, Product, ProductResourceType } from '../types';
import { StorageService } from '../services/storageService';
import { EmailService } from '../services/emailService';
import { useNavigate } from 'react-router-dom';
import { ADMIN_EMAIL } from '../constants';
import { Check, X, Upload, Trash2, Users, ShoppingBag, FileText, Lock, Send, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface AdminProps {
  user: User | null;
}

const Admin: React.FC<AdminProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'products' | 'users'>('requests');
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setAllUsers] = useState<User[]>([]);
  
  // Product Form State
  const [newProduct, setNewProduct] = useState<{
    title: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    fileUrl: string;
    resourceType: ProductResourceType;
  }>({
    title: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: 'https://picsum.photos/400/300',
    fileUrl: '',
    resourceType: 'PDF'
  });

  useEffect(() => {
    // Strict Access Control: Must be Role ADMIN AND the specific email address
    if (!user || user.role !== UserRole.ADMIN || user.email !== ADMIN_EMAIL) {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    setRequests(StorageService.getPaymentRequests().reverse()); // Newest first
    setProducts(StorageService.getProducts());
    setAllUsers(StorageService.getAllUsers());
  };

  const handlePaymentAction = (id: string, status: SubscriptionStatus) => {
    // 1. Update Database
    StorageService.updatePaymentStatus(id, status);
    
    // 2. Trigger Automated Email
    const request = requests.find(r => r.id === id);
    if (request) {
        const targetUser = users.find(u => u.id === request.userId);
        if (targetUser) {
            EmailService.sendPaymentUpdate(targetUser, request, status);
            
            // 3. Confirm to Management
            const actionWord = status === SubscriptionStatus.ACTIVE || status === SubscriptionStatus.APPROVED ? 'APPROVED' : 'DECLINED';
            alert(`✅ Request ${actionWord}.\n\nAn automated email has been sent to ${targetUser.email} notifying them of the update.`);
        }
    }
    loadData();
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
        id: crypto.randomUUID(),
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        imageUrl: newProduct.imageUrl || 'https://picsum.photos/400/300',
        fileUrl: newProduct.fileUrl || '#',
        resourceType: newProduct.resourceType
    };
    StorageService.addProduct(product);
    
    // Trigger Newsletter Blast
    EmailService.sendProductAlert(product, users);
    alert('Product added and email blast triggered to all users!');

    setNewProduct({
        title: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: 'https://picsum.photos/400/300',
        fileUrl: '',
        resourceType: 'PDF'
    });
    loadData();
  };

  const handleDeleteProduct = (id: string) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
        StorageService.deleteProduct(id);
        loadData();
    }
  };

  // Safe guard render
  if (!user || user.email !== ADMIN_EMAIL) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                <Lock className="h-8 w-8 text-red-600 mr-2" />
                Management Dashboard
            </h1>
            <p className="text-slate-500">
                Logged in as: <span className="font-mono font-medium text-slate-700">{user.email}</span>
            </p>
        </div>
      </div>

      <div className="border-b border-slate-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('requests')}
            className={`${activeTab === 'requests' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Request Management
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`${activeTab === 'products' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Product Management
          </button>
           <button
            onClick={() => setActiveTab('users')}
            className={`${activeTab === 'users' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            User Management
          </button>
        </nav>
      </div>

      {activeTab === 'requests' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 border-b border-slate-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-slate-900">Pending Requests</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Approve or Decline transactions. Actions automatically email the customer.
            </p>
          </div>
          <ul className="divide-y divide-slate-200">
            {requests.length === 0 && (
                <li className="p-12 text-center text-slate-500 flex flex-col items-center">
                    <Check className="h-12 w-12 text-slate-300 mb-4" />
                    <p>All requests handled.</p>
                </li>
            )}
            {requests.map((req) => (
              <li key={req.id} className="hover:bg-slate-50 transition-colors">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full flex-shrink-0 ${req.type === 'SUBSCRIPTION' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                            {req.type === 'SUBSCRIPTION' ? <Users className="h-6 w-6" /> : <ShoppingBag className="h-6 w-6" />}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-base font-bold text-slate-900">
                                {req.type === 'SUBSCRIPTION' ? '1 Year AI Subscription' : `Store Order (${req.items?.length || 0} items)`}
                            </p>
                            <p className="text-sm text-slate-600 font-medium">Customer: {req.userName} ({req.userEmail})</p>
                            
                            <div className="mt-2 text-sm bg-yellow-50 p-2 rounded border border-yellow-100 text-yellow-800">
                                <span className="font-bold">MMG Details:</span><br/>
                                Transaction ID: <span className="font-mono select-all">{req.transactionId}</span><br/>
                                Sender: {req.mmgSenderName} ({req.mmgSenderPhone})
                            </div>
                            
                            <p className="text-xs text-slate-400 mt-2">
                                Amount: GYD ${req.amount.toLocaleString()} • Submitted: {new Date(req.dateSubmitted).toLocaleDateString()}
                            </p>
                            
                            {/* Order items detail */}
                            {req.type === 'ORDER' && req.items && (
                                <div className="mt-2 text-xs text-slate-500">
                                    <p className="font-semibold">Items included:</p>
                                    <ul className="list-disc pl-4">
                                        {req.items.map(i => <li key={i.id}>{i.title}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Action Section */}
                    <div className="flex flex-col items-end space-y-2">
                        {req.status === SubscriptionStatus.PENDING ? (
                            <div className="flex flex-col gap-2">
                                <p className="text-xs text-slate-400 text-right mb-1">Actions trigger auto-email <Send className="h-3 w-3 inline" /></p>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => handlePaymentAction(req.id, req.type === 'SUBSCRIPTION' ? SubscriptionStatus.ACTIVE : SubscriptionStatus.APPROVED)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm"
                                    >
                                        <Check className="h-4 w-4 mr-2" /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handlePaymentAction(req.id, SubscriptionStatus.REJECTED)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 shadow-sm"
                                    >
                                        <X className="h-4 w-4 mr-2" /> Decline
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-right">
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                    req.status === SubscriptionStatus.ACTIVE || req.status === SubscriptionStatus.APPROVED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {req.status}
                                </span>
                                <p className="text-xs text-slate-400 mt-1">Processed</p>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-8">
            {/* Create Product Form */}
            <div className="bg-white shadow sm:rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Add New Resource</h3>
                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Resource Title</label>
                            <input type="text" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" placeholder="e.g. Grade 6 Math Guide" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Category</label>
                            <input type="text" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" placeholder="e.g. Worksheets" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Price (GYD)</label>
                            <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseInt(e.target.value)})} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Resource Type</label>
                            <select 
                                value={newProduct.resourceType} 
                                onChange={(e) => setNewProduct({...newProduct, resourceType: e.target.value as ProductResourceType})}
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2"
                            >
                                <option value="PDF">PDF Document</option>
                                <option value="IMAGE">Image File</option>
                                <option value="LINK">External Link</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" rows={3} placeholder="Short description of the resource..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Cover Image URL</label>
                            <input type="text" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Resource Download/Link URL</label>
                            <input type="text" required value={newProduct.fileUrl} onChange={e => setNewProduct({...newProduct, fileUrl: e.target.value})} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" placeholder={newProduct.resourceType === 'LINK' ? 'https://example.com' : 'https://.../file.pdf'} />
                        </div>
                    </div>
                    
                    <div className="md:col-span-2 mt-2">
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                            <Upload className="h-5 w-5 mr-2" /> Add Resource & Notify Users
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                 <div className="px-4 py-5 border-b border-slate-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-slate-900">Current Inventory</h3>
                 </div>
                 <ul className="divide-y divide-slate-200">
                     {products.map(p => (
                         <li key={p.id} className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-slate-50">
                             <div className="flex items-center">
                                 <div className="h-12 w-12 flex-shrink-0">
                                     <img src={p.imageUrl} alt="" className="h-12 w-12 rounded object-cover" />
                                 </div>
                                 <div className="ml-4">
                                     <p className="text-sm font-medium text-slate-900">{p.title}</p>
                                     <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                                         <span>${p.price.toLocaleString()}</span>
                                         <span>•</span>
                                         <span>{p.category}</span>
                                         <span>•</span>
                                         <span className="flex items-center border rounded px-1.5 bg-slate-100">
                                            {p.resourceType === 'PDF' && <FileText className="h-3 w-3 mr-1" />}
                                            {p.resourceType === 'IMAGE' && <ImageIcon className="h-3 w-3 mr-1" />}
                                            {p.resourceType === 'LINK' && <LinkIcon className="h-3 w-3 mr-1" />}
                                            {p.resourceType || 'PDF'}
                                         </span>
                                     </div>
                                 </div>
                             </div>
                             <div className="flex items-center space-x-4">
                                <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-xs font-medium">
                                    Test Link
                                </a>
                                <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                             </div>
                         </li>
                     ))}
                 </ul>
            </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-slate-900">Registered Users</h3>
                <p className="mt-1 max-w-2xl text-sm text-slate-500">Total count: {users.length}</p>
            </div>
            <div className="border-t border-slate-200">
                <ul className="divide-y divide-slate-200">
                    {users.map((u) => (
                        <li key={u.id} className="px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-900">{u.name}</p>
                                    <p className="text-sm text-slate-500">{u.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Joined: {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'}</p>
                                <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${u.subscriptionStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                    {u.role === UserRole.ADMIN ? 'ADMIN' : u.subscriptionStatus}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
