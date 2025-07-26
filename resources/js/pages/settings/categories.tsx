import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import AppLayout from '@/layouts/main-layout';
import SettingsLayout from '@/layouts/settings/layout';

import HeadingSmall from '@/components/shared/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { getCategoryColor } from '@/lib/utils/tasks/get-category-color';

import { useFlashMessages } from '@/hooks/use-flash-messages';

interface Category {
    id: number;
    name: string;
    color: string;
}

type CategoryForm = {
    name: string;
    color: string;
};

const colorOptions = [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
    { value: 'gray', label: 'Gray' },
    { value: 'purple', label: 'Purple' },
    { value: 'indigo', label: 'Indigo' },
];

export default function Categories() {
    useFlashMessages();

    // Mock categories data - in real app this would come from props
    const [categories, setCategories] = useState<Category[]>([
        { id: 1, name: 'Health', color: 'blue' },
        { id: 2, name: 'Home', color: 'green' },
        { id: 3, name: 'Personal', color: 'purple' },
        { id: 4, name: 'Auto', color: 'orange' },
        { id: 5, name: 'Documents', color: 'gray' },
    ]);

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const {
        data: editData,
        setData: setEditData,
        processing: editProcessing,
        reset: resetEdit,
    } = useForm<CategoryForm>({
        name: '',
        color: 'blue',
    });

    const {
        data: addData,
        setData: setAddData,
        processing: addProcessing,
        reset: resetAdd,
    } = useForm<CategoryForm>({
        name: '',
        color: 'blue',
    });

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setEditData({
            name: category.name,
            color: category.color,
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit: FormEventHandler = (e) => {
        e.preventDefault();

        if (editingCategory) {
            // Update the category in state (in real app this would be an API call)
            setCategories((prev) =>
                prev.map((cat) => (cat.id === editingCategory.id ? { ...cat, name: editData.name, color: editData.color } : cat)),
            );

            setIsEditModalOpen(false);
            setEditingCategory(null);
            resetEdit();

            console.log('Updated category:', { id: editingCategory.id, ...editData });
        }
    };

    const handleAddCategory: FormEventHandler = (e) => {
        e.preventDefault();

        // Add new category to state (in real app this would be an API call)
        const newCategory: Category = {
            id: Math.max(...categories.map((c) => c.id)) + 1,
            name: addData.name,
            color: addData.color,
        };

        setCategories((prev) => [...prev, newCategory]);
        setIsAddModalOpen(false);
        resetAdd();

        console.log('Added category:', newCategory);
    };

    const handleSaveAll = () => {
        // TODO: This will be wired up to a backend endpoint later
        console.log('Saving all categories:', categories);
    };

    return (
        <AppLayout title="Categories">
            <Head title="Categories" />

            <SettingsLayout>
                <Card>
                    <CardHeader>
                        <HeadingSmall title="Categories" description="Customise task categories and their colours" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {categories.map((category) => (
                                <div key={category.id} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${getCategoryColor(category.color).split(' ')[0]}`} />
                                        <span className="font-medium">{category.name}</span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                                        Edit
                                    </Button>
                                </div>
                            ))}

                            <div className="pt-4">
                                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Add category</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add Category</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleAddCategory} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="add-name">Name</Label>
                                                <Input
                                                    id="add-name"
                                                    value={addData.name}
                                                    onChange={(e) => setAddData('name', e.target.value)}
                                                    placeholder="Category name"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="add-color">Color</Label>
                                                <Select value={addData.color} onValueChange={(value) => setAddData('color', value)}>
                                                    <SelectTrigger id="add-color">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`w-3 h-3 rounded-full ${getCategoryColor(addData.color).split(' ')[0]}`}
                                                            />
                                                            <SelectValue />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {colorOptions.map((color) => (
                                                            <SelectItem key={color.value} value={color.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className={`w-3 h-3 rounded-full ${getCategoryColor(color.value).split(' ')[0]}`}
                                                                    />
                                                                    {color.label}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex justify-end gap-2">
                                                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit" disabled={addProcessing}>
                                                    Add Category
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="pt-6 border-t">
                                <Button onClick={handleSaveAll}>Save</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Category Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    placeholder="Category name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-color">Color</Label>
                                <Select value={editData.color} onValueChange={(value) => setEditData('color', value)}>
                                    <SelectTrigger id="edit-color">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${getCategoryColor(editData.color).split(' ')[0]}`} />
                                            <SelectValue />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colorOptions.map((color) => (
                                            <SelectItem key={color.value} value={color.value}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(color.value).split(' ')[0]}`} />
                                                    {color.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editProcessing}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </SettingsLayout>
        </AppLayout>
    );
}
