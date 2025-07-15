import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, X, Check } from 'lucide-react';
import { WhitelistItem } from '../types';
import { validateMac } from '../utils/deviceUtils';

interface WhitelistTabProps {
  whitelist: WhitelistItem[];
  onSave: (whitelist: { name: string; macs: string[] }) => Promise<any>;
  onUpdate: (id: number, whitelist: { name: string; macs: string[] }) => Promise<any>;
  onDelete: (id: number) => Promise<any>;
}

export function WhitelistTab({ whitelist, onSave, onUpdate, onDelete }: WhitelistTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WhitelistItem | null>(null);
  const [formData, setFormData] = useState({ name: '', macs: '' });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const macs = formData.macs
      .split('\n')
      .map(mac => mac.trim())
      .filter(mac => mac.length > 0);

    // Validar MACs
    const invalidMacs = macs.filter(mac => !validateMac(mac));
    if (invalidMacs.length > 0) {
      setErrors([`MACs inválidos: ${invalidMacs.join(', ')}`]);
      return;
    }

    setErrors([]);

    try {
      if (editingItem) {
        await onUpdate(editingItem.id, { name: formData.name, macs });
      } else {
        await onSave({ name: formData.name, macs });
      }
      
      setShowForm(false);
      setEditingItem(null);
      setFormData({ name: '', macs: '' });
    } catch (error) {
      setErrors(['Erro ao salvar lista']);
    }
  };

  const handleEdit = (item: WhitelistItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      macs: item.macs.join('\n')
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar esta lista?')) {
      await onDelete(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ name: '', macs: '' });
    setErrors([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white">MAC Whitelist</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New List
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingItem ? 'Edit List' : 'New List'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                List Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., IT, Guests, etc."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                MACs (one per line)
              </label>
              <textarea
                value={formData.macs}
                onChange={(e) => setFormData({ ...formData, macs: e.target.value })}
                placeholder="AA:BB:CC:DD:EE:FF&#10;11:22:33:44:55:66&#10;..."
                rows={6}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Format: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
              </p>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-400 text-sm">{error}</p>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                {editingItem ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Whitelist Lists */}
      <div className="space-y-4">
        {whitelist.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{item.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                MACs ({item.macs.length}):
              </p>
              <div className="bg-gray-700/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                {item.macs.map((mac, index) => (
                  <div key={index} className="text-sm text-gray-300 font-mono">
                    {mac}
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mt-2">
              Created: {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {whitelist.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">
            No whitelist created yet.
          </p>
        </div>
      )}
    </div>
  );
}