import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { Input } from '../../components/shared/Input';
import { Textarea } from '../../components/shared/Textarea';
import { Select } from '../../components/shared/Select';
import { FileUpload } from '../../components/shared/FileUpload';
import { EmptyState } from '../../components/shared/EmptyState';
import { Plus, Edit, Trash2, GripVertical, Coffee } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  available: boolean;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  visible: boolean;
}

const initialCategories: Category[] = [
  { id: '1', name: 'نوشیدنی‌های گرم', visible: true },
  { id: '2', name: 'نوشیدنی‌های سرد', visible: true },
  { id: '3', name: 'دسرها', visible: true },
];

const initialItems: MenuItem[] = [
  {
    id: '1',
    name: 'کاپوچینو',
    description: 'اسپرسو با شیر گرم و کف شیر',
    price: '45000',
    category: '1',
    image: '/images/food-1.jpg
    available: true,
    tags: ['محبوب'],
  },
  {
    id: '2',
    name: 'لاته',
    description: 'اسپرسو با شیر داغ',
    price: '50000',
    category: '1',
    available: true,
    tags: [],
  },
];

export function MenuManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [menuItems, setMenuItems] = useState(initialItems);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '1',
    tags: '',
    available: true,
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      description: '',
      price: '',
      category: '1',
      tags: '',
      available: true,
    });
    setShowItemModal(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      tags: item.tags.join(', '),
      available: item.available,
    });
    setShowItemModal(true);
  };

  const handleSaveItem = () => {
    if (editingItem) {
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...itemForm,
                tags: itemForm.tags.split(',').map((t) => t.trim()),
              }
            : item
        )
      );
    } else {
      const newItem: MenuItem = {
        id: String(Date.now()),
        ...itemForm,
        tags: itemForm.tags.split(',').map((t) => t.trim()),
      };
      setMenuItems([...menuItems, newItem]);
    }
    setShowItemModal(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('آیا از حذف این آیتم اطمینان دارید؟')) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'نامشخص';
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isManager isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl mb-2">مدیریت منو</h1>
              <p className="text-muted-foreground">افزودن و ویرایش آیتم‌های منو</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                icon={Plus}
                onClick={() => setShowCategoryModal(true)}
              >
                دسته‌بندی جدید
              </Button>
              <Button variant="primary" icon={Plus} onClick={handleAddItem}>
                آیتم جدید
              </Button>
            </div>
          </div>

          {/* Categories & Items */}
          {categories.length > 0 ? (
            <div className="space-y-8">
              {categories.map((category) => {
                const items = menuItems.filter((item) => item.category === category.id);
                return (
                  <div key={category.id} className="bg-white rounded-xl border border-border">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                      <h2 className="text-xl font-medium">{category.name}</h2>
                      <span className="text-sm text-muted-foreground">
                        {items.length} آیتم
                      </span>
                    </div>

                    {items.length > 0 ? (
                      <div className="divide-y divide-border">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="p-6 flex items-start gap-4 hover:bg-muted/30 transition-colors"
                          >
                            <button className="cursor-grab p-2 hover:bg-muted rounded">
                              <GripVertical className="w-4 h-4 text-muted-foreground" />
                            </button>

                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                                <Coffee className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-medium mb-1">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                                <p className="text-primary font-medium whitespace-nowrap mr-4">
                                  {Number(item.price).toLocaleString()} تومان
                                </p>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs ${
                                    item.available
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {item.available ? 'موجود' : 'ناموجود'}
                                </span>
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6">
                        <EmptyState
                          icon={Coffee}
                          title="هنوز آیتمی در این دسته وجود ندارد"
                          actionLabel="افزودن آیتم"
                          onAction={handleAddItem}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-border">
              <EmptyState
                icon={Coffee}
                title="هنوز دسته‌بندی ایجاد نکرده‌اید"
                description="برای شروع، یک دسته‌بندی برای منوی خود ایجاد کنید"
                actionLabel="افزودن دسته‌بندی"
                onAction={() => setShowCategoryModal(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Item Modal */}
      <Modal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        title={editingItem ? 'ویرایش آیتم' : 'افزودن آیتم جدید'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowItemModal(false)}>
              انصراف
            </Button>
            <Button variant="primary" onClick={handleSaveItem}>
              ذخیره
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="نام آیتم"
            required
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            placeholder="مثال: کاپوچینو"
          />
          <Textarea
            label="توضیحات"
            rows={3}
            value={itemForm.description}
            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
            placeholder="توضیح کوتاهی درباره این آیتم..."
          />
          <Input
            label="قیمت (تومان)"
            type="number"
            required
            value={itemForm.price}
            onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
            placeholder="45000"
          />
          <Select
            label="دسته‌بندی"
            required
            value={itemForm.category}
            onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
            options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
          />
          <Input
            label="برچسب‌ها"
            value={itemForm.tags}
            onChange={(e) => setItemForm({ ...itemForm, tags: e.target.value })}
            placeholder="محبوب، گیاهی، تند (با کاما جدا کنید)"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={itemForm.available}
              onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="available" className="text-sm">
              موجود است
            </label>
          </div>
          <FileUpload
            label="تصویر آیتم"
            accept="image/*"
            onFilesChange={() => {}}
          />
        </div>
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="افزودن دسته‌بندی"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCategoryModal(false)}>
              انصراف
            </Button>
            <Button variant="primary" onClick={() => setShowCategoryModal(false)}>
              ذخیره
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="نام دسته‌بندی" required placeholder="مثال: نوشیدنی‌های گرم" />
        </div>
      </Modal>
    </div>
  );
}
