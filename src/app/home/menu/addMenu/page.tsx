"use client";

import { api } from "@/lib/api/axios";
import { resturantContext } from "@/lib/context/Context";
import { MenuItem } from "@/lib/interfaces/order";
import Result from "@/lib/Result";
import { menuSchema, MenuForm, MenuFormInput } from "@/schemas/menu.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, NotebookPen, SaveCheck, Search, X } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CategoryResponse {
    id?: string;
    name?: string;
    categoryName?: string;
    catagory?: string;
}

export default function Addmenu() {
    const [statusMessage, setStatusMessage] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [categorySearch, setCategorySearch] = useState("");
    const [showCategories, setShowCategories] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [itemPhoto, setItemPhoto] = useState<File | null>(null);
    const [itemPhotoPreview, setItemPhotoPreview] = useState<string | null>(null);
    const {defaultResturant , setpopup , setservererror} = useContext(resturantContext);
    const menuForm = useForm<MenuFormInput, undefined, MenuForm>({
        resolver: zodResolver(menuSchema),
        mode: "onBlur",
        defaultValues: {
            itemName: "",
            catagory: "",
            price: 0,
            description: "",
        },
    });
    const selectedCategory = menuForm.watch("catagory");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            setLoadingCategories(true);
            try {
                const { data } = await api.get<Result<string[] | CategoryResponse[]>>("/menu/GetCategories");
                const categoryData = Array.isArray(data.Data) ? data.Data : [];
                const names = categoryData
                    .map((category) => typeof category === "string"
                        ? category
                        : category.name ?? category.categoryName ?? category.catagory ?? "")
                    .filter(Boolean);
                setCategories([...new Set(names)]);
            } catch (error) {
                console.error(error);
                setStatusMessage("Could not load food categories");
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, []);

    const handleFile = (
        file: File | undefined,
        setSelectedFile: (file: File) => void,
        setPreview: (preview: string) => void,
    ) => {
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setStatusMessage("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setStatusMessage("File size exceeds 5MB limit");
            return;
        }

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setStatusMessage("");
    };

    const filteredCategories = categories.filter((category) =>
        category.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const handleSubmit = async (payload: MenuForm) => {
         if (!itemPhoto) {
          setStatusMessage("Items photo is required.");
          return;
         }

         try {
        const payloaddata:MenuItem[] = [{
            resturentId:defaultResturant,
             itemName: payload.itemName,
            catagory: payload.catagory,
            price: Number(payload.price),
            description: payload.description,
        } as MenuItem ]
        const textupload = await api.post<Result<MenuItem[]>>("menu/CreateMenu", payloaddata);
        if(!textupload.data.Success){
            setStatusMessage(textupload.data.Message);
            return;
        }
        console.log(textupload.data);
        setStatusMessage("Menu item saved.. Uploading Image");
        const imageData = new FormData();
        imageData.append("file", itemPhoto);
        const createdItemId = textupload.data.Data?.[0]?.id;
        if (!createdItemId) {
            setStatusMessage("Menu item was created but its ID was not returned.");
            return;
        }
        const {data} = await api.post<Result<string>>(
            `files/uploadImages?menuId=${createdItemId}`,
            imageData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        console.log(data);

        if(!data.Success){
            setStatusMessage(data.Message);
            return;
        }
        setpopup("Item added to the menu");
        setStatusMessage("Item added to the menu");
       }catch (error) {
        console.error("Error saving menu item:", error);
        setpopup("Failed to save menu item. Please try again.");
       }
        
    };

    const handleDiscard = () => {
        menuForm.reset();
        setCategorySearch("");
        setDescription("");
        setItemPhoto(null);
        setItemPhotoPreview(null);
        setStatusMessage("");
    };

    return(<>
    <div>
    <div className="flex flex-row mt-3 gap-2"> <NotebookPen  />  Menu Management.... Add Menu Item </div>
    <div className="flex flex-row mt-5 justify-between items-center"> 
        <span className="text-2xl font-semibold">Add Menu Items</span>
        <span className="flex flex-row gap-5 items-center mr-10">
        <button type="button" onClick={handleDiscard} className="flex flex-row gap-1 items-center justify-center shadow text-black font-semibold bg-[#EFEEEB] p-2 rounded-[10px] hover:scale-95 cursor-pointer duration-150"> <X size={20}/> Discard </button>
        <button type="submit" form="add-menu-form" className="flex flex-row gap-1 items-center justify-center shadow text-white font-semibold bg-[#A13924] p-2 rounded-[10px] hover:scale-95 cursor-pointer duration-150"> <SaveCheck size={20} /> Save Menu Items </button>
        </span>
    </div>

    <div>
        <div className=" bg-white w-[50%] p-5 flex-col shadow rounded-[10px]">
            <span className="flex flex-col">
                <span className="font-semibold text-[20px]">Menu Item Details</span>
                <span>Required Fields Marked <span className="text-red-700"> * </span></span>
            </span>
            <hr className="text-[#A13924]"/>
            <div className="mt-5">
                <form id="add-menu-form" onSubmit={menuForm.handleSubmit(handleSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="itemName" className="font-medium">Item Name <span className="text-red-700">*</span></label>
                        <input id="itemName" {...menuForm.register("itemName")} type="text" className={`h-10 rounded-[8px] border px-3 shadow ${menuForm.formState.errors.itemName ? "border-red-500" : "border-gray-400"}`} />
                        {menuForm.formState.errors.itemName && <p className="text-sm text-red-700">{menuForm.formState.errors.itemName.message}</p>}
                    </div>

                    <div className="relative flex flex-col gap-2">
                        <label htmlFor="categorySearch" className="font-medium">Category <span className="text-red-700">*</span></label>
                        <div className="relative">
                            <Search size={17} className="absolute left-3 top-3 text-gray-500" />
                            <input
                                id="categorySearch"
                                value={categorySearch || selectedCategory}
                                onChange={(event) => {
                                    setCategorySearch(event.target.value);
                                    setShowCategories(true);
                                }}
                                onFocus={() => setShowCategories(true)}
                                placeholder={loadingCategories ? "Loading categories..." : "Search food category"}
                                className={`h-10 w-full rounded-[8px] border bg-white pl-9 pr-3 shadow ${menuForm.formState.errors.catagory ? "border-red-500" : "border-gray-400"}`}
                                autoComplete="off"
                            />
                        </div>
                        {showCategories && <div className="absolute left-0 right-0 top-[4.8rem] z-10 max-h-44 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                            {filteredCategories.length > 0 ? filteredCategories.map((category) => (
                                <button key={category} type="button" onClick={() => { menuForm.setValue("catagory", category, { shouldValidate: true, shouldDirty: true }); setCategorySearch(""); setShowCategories(false); }} className="block w-full px-3 py-2 text-left hover:bg-[#f7e9e5]">
                                    {category}
                                </button>
                            )) : <p className="px-3 py-2 text-sm text-gray-500">No categories found</p>}
                        </div>}
                        {menuForm.formState.errors.catagory && <p className="text-sm text-red-700">{menuForm.formState.errors.catagory.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="price" className="font-medium">Price <span className="text-red-700">*</span></label>
                        <input id="price" {...menuForm.register("price")} type="number" min="1" step="0.01" className={`h-10 rounded-[8px] border px-3 shadow ${menuForm.formState.errors.price ? "border-red-500" : "border-gray-400"}`} />
                        {menuForm.formState.errors.price && <p className="text-sm text-red-700">{menuForm.formState.errors.price.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label htmlFor="description" className="flex justify-between font-medium">
                            <span>Description</span>
                            <span className="text-sm font-normal text-gray-500">{description.length}/250</span>
                        </label>
                        <textarea
                            id="description"
                            {...menuForm.register("description")}
                            onChange={(event) => {
                                setDescription(event.target.value);
                                menuForm.setValue("description", event.target.value, { shouldValidate: true, shouldDirty: true });
                            }}
                            rows={4}
                            maxLength={250}
                            className={`rounded-[8px] border px-3 py-2 shadow ${menuForm.formState.errors.description ? "border-red-500" : "border-gray-400"}`}
                            placeholder="Describe the menu item"
                        />
                        {menuForm.formState.errors.description && <p className="text-sm text-red-700">{menuForm.formState.errors.description.message}</p>}
                    </div>
                </div>
                {statusMessage && <p className="mt-4 text-sm text-[#A13924]">{statusMessage}</p>}
                <div className="border-t border-[#eadbd5] pt-5">
                    <div className="flex flex-col gap-2">
                        <div>
                            <p className="font-medium">Items Photo <span className="text-red-700">*</span></p>
                            <p className="text-sm text-gray-500">Image up to 5 MB</p>
                        </div>
                        <label htmlFor="item-photo" className="group flex min-h-36 cursor-pointer flex-col w-fit p-1 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[#d8b6aa] bg-[#fffaf8] text-center transition hover:border-[#A13924] hover:bg-[#fff4f0]">
                            {itemPhotoPreview ? (
                                <Image src={itemPhotoPreview} width={200} height={200} alt="Items photo preview" className="h-40 w-40 object-cover rounded-2xl" />
                            ) : (
                                <>
                                    <span className="mb-2 rounded-full bg-[#f7e9e5] p-3 text-[#A13924]"><ImagePlus size={22} /></span>
                                    <span className="font-medium text-[#A13924]">Choose items photo</span>
                                    <span className="mt-1 text-xs text-gray-500">JPG, PNG or WEBP</span>
                                </>
                            )}
                            <input
                                id="item-photo"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                required
                                className="sr-only"
                                onChange={(event) => handleFile(event.target.files?.[0], setItemPhoto, setItemPhotoPreview)}
                            />
                        </label>
                        {itemPhoto && <p className="truncate text-sm text-gray-600">{itemPhoto.name}</p>}
                    </div>
                </div>
                </form>
            </div>
        </div>
    </div>
    </div>
    </>)
}