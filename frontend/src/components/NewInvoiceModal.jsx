import React, { useState } from 'react';
import { Plus, X, Calendar, DollarSign, User, FileText, Save, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import toast from 'react-hot-toast';

const NewInvoiceModal = ({ isOpen, onClose, onSave }) => {
  const [invoiceData, setInvoiceData] = useState({
    number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    client: '',
    clientEmail: '',
    project: '',
    description: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      { description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    notes: '',
    terms: 'Payment is due within 14 days of invoice date.'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' || field === 'rate' ? parseFloat(value) || 0 : value
    };
    
    // Calculate amount for this item
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setInvoiceData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSave = async (status = 'Draft') => {
    if (!invoiceData.client || !invoiceData.project || invoiceData.items.some(item => !item.description)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const newInvoice = {
        id: `INV-${Date.now()}`,
        ...invoiceData,
        amount: calculateTotal(),
        status,
        createdDate: new Date().toISOString(),
        paidDate: null,
        paymentLink: null
      };

      await onSave(newInvoice);
      toast.success(`Invoice ${status === 'Draft' ? 'saved' : 'sent'} successfully!`);
      onClose();
      resetForm();
    } catch (error) {
      toast.error('Failed to save invoice');
      console.error('Error saving invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setInvoiceData({
      number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      client: '',
      clientEmail: '',
      project: '',
      description: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        { description: '', quantity: 1, rate: 0, amount: 0 }
      ],
      notes: '',
      terms: 'Payment is due within 14 days of invoice date.'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Create New Invoice
          </DialogTitle>
          <DialogDescription>
            Create a professional invoice for your client
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="number">Invoice Number</Label>
              <Input
                id="number"
                value={invoiceData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={invoiceData.issueDate}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Client Name *</Label>
                  <Select value={invoiceData.client} onValueChange={(value) => handleInputChange('client', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select client..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TechStart Inc.">TechStart Inc.</SelectItem>
                      <SelectItem value="Design Studio Pro">Design Studio Pro</SelectItem>
                      <SelectItem value="Startup Ventures">Startup Ventures</SelectItem>
                      <SelectItem value="Enterprise Corp">Enterprise Corp</SelectItem>
                      <SelectItem value="Creative Agency">Creative Agency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@example.com"
                    value={invoiceData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project">Project *</Label>
                  <Input
                    id="project"
                    placeholder="Project name..."
                    value={invoiceData.project}
                    onChange={(e) => handleInputChange('project', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the project..."
                  value={invoiceData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Line Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoiceData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Label htmlFor={`description-${index}`}>Description *</Label>
                      <Input
                        id={`description-${index}`}
                        placeholder="Service description..."
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`rate-${index}`}>Rate ($)</Label>
                      <Input
                        id={`rate-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Amount</Label>
                      <div className="mt-1 p-2 bg-muted rounded-md text-sm font-medium">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={invoiceData.items.length === 1}
                        className="mt-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addItem}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Line Item
                </Button>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes for the client..."
                  value={invoiceData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={invoiceData.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave('Draft')}
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSave('Sent')}
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? 'Sending...' : 'Send Invoice'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewInvoiceModal;

