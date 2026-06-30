import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Loader2, Plus, Pencil, Trash2, Users, Hash, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getManagerTables, createTable, updateTable, deleteTable } from '../../services/restaurant.service';
import { inputClass, FieldError } from '../../utils/validators';
import { useForm } from 'react-hook-form';
import type { Table } from '../../types';

type TableFormData = { tableNumber: string; capacity: string };

export function TableManagement() {
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [tables,       setTables]       = useState<Table[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isError,      setIsError]      = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [showForm,     setShowForm]     = useState(false);
  const [isSaving,     setIsSaving]     = useState(false);

  const restaurantId = localStorage.getItem('restaurantId') ?? '2';

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TableFormData>();

  const load = async () => {
    setIsLoading(true);
    setIsError(false);
    try { setTables(await getManagerTables()); }
    catch { setIsError(true); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingTable(null);
    reset({ tableNumber: '', capacity: '' });
    setShowForm(true);
  };

  const openEdit = (t: Table) => {
    setEditingTable(t);
    setValue('tableNumber', String(t.TableNumber));
    setValue('capacity',    String(t.Capacity));
    setShowForm(true);
  };

  const onSubmit = async (data: TableFormData) => {
    setIsSaving(true);
    try {
      if (editingTable) {
        await updateTable({
          TableId:     editingTable.Id,
          TableNumber: Number(data.tableNumber),
          Capacity:    Number(data.capacity),
        });
        setTables(tables.map((t) =>
          t.Id === editingTable.Id
            ? { ...t, TableNumber: Number(data.tableNumber), Capacity: Number(data.capacity) }
            : t
        ));
        toast.success('میز ویرایش شد');
      } else {
        await createTable({ RestaurantId: restaurantId, TableNumber: Number(data.tableNumber), Capacity: Number(data.capacity) });
        const newTable: Table = {
          Id:           `tbl-${Date.now()}`,
          RestaurantId: restaurantId,
          TableNumber:  Number(data.tableNumber),
          Capacity:     Number(data.capacity),
        };
        setTables([...tables, newTable]);
        toast.success('میز اضافه شد');
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا در ذخیره میز');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (tableId: string) => {
    if (!window.confirm('آیا از حذف این میز مطمئن هستید؟')) return;
    try {
      await deleteTable({ TableId: tableId });
      setTables(tables.filter((t) => t.Id !== tableId));
      toast.success('میز حذف شد');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا در حذف میز');
    }
  };

  const totalCapacity = tables.reduce((sum, t) => sum + t.Capacity, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isManager isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        <div className="p-6 md:p-8 lg:p-10">

          {/* هدر */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl mb-2">مدیریت میزها</h1>
              <p className="text-muted-foreground">
                {isLoading ? '...' : `${tables.length} میز — ظرفیت کل: ${totalCapacity} نفر`}
              </p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              میز جدید
            </button>
          </div>

          {/* فرم افزودن/ویرایش */}
          {showForm && (
            <div className="bg-white rounded-xl border border-primary/30 p-6 mb-6">
              <h3 className="font-semibold mb-4">{editingTable ? 'ویرایش میز' : 'افزودن میز جدید'}</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">شماره میز</label>
                  <input
                    type="number"
                    {...register('tableNumber', {
                      required: 'شماره میز الزامی است',
                      min: { value: 1, message: 'شماره باید بیشتر از صفر باشد' },
                    })}
                    className={inputClass(!!errors.tableNumber)}
                    placeholder="مثال: ۱"
                  />
                  <FieldError message={errors.tableNumber?.message} />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">ظرفیت (نفر)</label>
                  <input
                    type="number"
                    {...register('capacity', {
                      required: 'ظرفیت الزامی است',
                      min: { value: 1, message: 'ظرفیت باید بیشتر از صفر باشد' },
                      max: { value: 20, message: 'ظرفیت نمی‌تواند بیشتر از ۲۰ باشد' },
                    })}
                    className={inputClass(!!errors.capacity)}
                    placeholder="مثال: ۴"
                  />
                  <FieldError message={errors.capacity?.message} />
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" disabled={isSaving}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2">
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingTable ? 'ذخیره تغییرات' : 'افزودن میز'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm">
                    انصراف
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* بارگذاری */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {/* خطا */}
          {!isLoading && isError && (
            <div className="flex flex-col items-center py-16 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <p className="text-muted-foreground mb-4">خطا در بارگذاری میزها</p>
              <button onClick={load} className="text-primary hover:underline text-sm">تلاش مجدد</button>
            </div>
          )}

          {/* لیست میزها */}
          {!isLoading && !isError && (
            tables.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">هنوز میزی ثبت نشده</h3>
                <p className="text-sm text-muted-foreground mb-4">با کلیک روی «میز جدید» شروع کنید</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tables.map((t) => (
                  <div key={t.Id} className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Hash className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(t)}
                          className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(t.Id)}
                          className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-2xl font-bold mb-0.5">میز {t.TableNumber}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{t.Capacity} نفره</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}