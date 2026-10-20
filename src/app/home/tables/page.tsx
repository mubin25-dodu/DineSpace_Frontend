"use client";

import { api } from "@/lib/api/axios";
import { restaurantContext } from "@/lib/context/Context";
import { TableStatus } from "@/lib/Enums";
import { OrderTable } from "@/lib/interfaces/order";
import Result from "@/lib/Result";
import { motion } from "motion/react";
import {
    Armchair,
    Edit3,
    Plus,
    Search,
    Trash2,
    Users,
    X,
} from "lucide-react";
import {
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type StatusFilter = "All" | TableStatus;

interface TableForm {
    tableno: string;
    seatCapacity: string;
}

const emptyForm: TableForm = {
    tableno: "",
    seatCapacity: "",
};

export default function TablesPage() {
    const { defaultRestaurant, setpopup } =
        useContext(restaurantContext);

    const [tables, setTables] = useState<OrderTable[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("All");

    const [showForm, setShowForm] = useState(false);
    const [editingTable, setEditingTable] =
        useState<OrderTable | null>(null);

    const [form, setForm] = useState<TableForm>(emptyForm);
    const [saving, setSaving] = useState(false);

    // --------------------------------------------------
    // Load tables
    // --------------------------------------------------

    const getTables = async () => {
        if (!defaultRestaurant) {
            setTables([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const { data } = await api.get<Result<OrderTable[]>>(
                `/tables/getTablesByResturantId/${defaultRestaurant}`
            );

            if (data.Success) {
                setTables(
                    (data.Data ?? []).sort(
                        (a, b) => a.tableno - b.tableno
                    )
                );
            } else {
                setpopup(data.Message);
            }
        } catch (error) {
            console.error(error);
            setpopup("Could not load tables");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTables();
    }, [defaultRestaurant]);

    // --------------------------------------------------
    // Statistics
    // --------------------------------------------------

    const statistics = useMemo(() => {
        return {
            total: tables.length,

            available: tables.filter(
                (table) =>
                    table.status === TableStatus.Available
            ).length,

            occupied: tables.filter(
                (table) =>
                    table.status === TableStatus.Occupied
            ).length,

            reserved: tables.filter(
                (table) =>
                    table.status === TableStatus.Reserved
            ).length,

            cleaning: tables.filter(
                (table) =>
                    table.status === TableStatus.Cleaning
            ).length,
        };
    }, [tables]);

    // --------------------------------------------------
    // Search + filter
    // --------------------------------------------------

    const filteredTables = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return tables.filter((table) => {
            const matchesSearch =
                table.tableno
                    .toString()
                    .includes(search) ||
                table.seatCapacity
                    .toString()
                    .includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                table.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [tables, searchTerm, statusFilter]);

    // --------------------------------------------------
    // Open Add Table form
    // --------------------------------------------------

    const openAddForm = () => {
        setEditingTable(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    // --------------------------------------------------
    // Open Edit Table form
    // --------------------------------------------------

    const openEditForm = (table: OrderTable) => {
        setEditingTable(table);

        setForm({
            tableno: table.tableno.toString(),
            seatCapacity: table.seatCapacity.toString(),
        });

        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingTable(null);
        setForm(emptyForm);
    };

    // --------------------------------------------------
    // Add / Update table
    // --------------------------------------------------

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!defaultRestaurant) {
            setpopup("Please select a restaurant first");
            return;
        }

        const tableNumber = Number(form.tableno);
        const seatCapacity = Number(form.seatCapacity);

        if (
            !Number.isInteger(tableNumber) ||
            tableNumber < 1
        ) {
            setpopup("Please enter a valid table number");
            return;
        }

        if (
            !Number.isInteger(seatCapacity) ||
            seatCapacity < 1
        ) {
            setpopup("Seat capacity must be at least 1");
            return;
        }

        try {
            setSaving(true);

            // ---------------- ADD ----------------
            if (!editingTable) {
                const payload = [
                    {
                        tableno: tableNumber,
                        seatCapacity,
                        status: TableStatus.Available,
                        resturantid: defaultRestaurant,
                    },
                ];

                const { data } = await api.post<
                    Result<OrderTable[]>
                >("/tables/creatTable", payload);

                if (!data.Success) {
                    setpopup(data.Message);
                    return;
                }

                setpopup("Table added successfully");
            }

            // ---------------- UPDATE ----------------
            else {
                const payload = [
                    {
                        id: editingTable.id,
                        tableno: tableNumber,
                        seatCapacity,
                        status: editingTable.status,
                        resturantid: defaultRestaurant,
                    },
                ];

                const { data } = await api.patch<
                    Result<OrderTable[]>
                >("/tables/update", payload);

                if (!data.Success) {
                    setpopup(data.Message);
                    return;
                }

                setpopup("Table updated successfully");
            }

            closeForm();
            await getTables();
        } catch (error) {
            console.error(error);
            setpopup(
                editingTable
                    ? "Could not update table"
                    : "Could not add table"
            );
        } finally {
            setSaving(false);
        }
    };

    // --------------------------------------------------
    // Delete table
    // --------------------------------------------------

    const deleteTable = async (table: OrderTable) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete Table ${table.tableno}?`
        );

        if (!confirmed) return;

        try {
            const { data } = await api.delete<Result<unknown>>(
                `/tables/DeleteTable/${table.id}`
            );

            if (!data.Success) {
                setpopup(data.Message);
                return;
            }

            setTables((previous) =>
                previous.filter(
                    (currentTable) =>
                        currentTable.id !== table.id
                )
            );

            setpopup("Table deleted successfully");
        } catch (error) {
            console.error(error);
            setpopup("Could not delete table");
        }
    };

    // --------------------------------------------------
    // Change table status
    // --------------------------------------------------

    const changeStatus = async (
        table: OrderTable,
        newStatus: TableStatus
    ) => {
        const previousStatus = table.status;

        setTables((previous) =>
            previous.map((currentTable) =>
                currentTable.id === table.id
                    ? {
                          ...currentTable,
                          status: newStatus,
                      }
                    : currentTable
            )
        );

        let endpoint = "";

        switch (newStatus) {
            case TableStatus.Available:
                endpoint = `/tables/TableMakeaAvailable/${table.id}`;
                break;

            case TableStatus.Occupied:
                endpoint = `/tables/TableMakeaoccupied/${table.id}`;
                break;

            case TableStatus.Reserved:
                endpoint = `/tables/TableMakereserved/${table.id}`;
                break;

            case TableStatus.Cleaning:
                endpoint = `/tables/TableMakeCleaning/${table.id}`;
                break;
        }

        try {
            const { data } = await api.patch<
                Result<OrderTable>
            >(endpoint);

            if (!data.Success) {
                throw new Error(data.Message);
            }
        } catch (error) {
            console.error(error);

            // rollback
            setTables((previous) =>
                previous.map((currentTable) =>
                    currentTable.id === table.id
                        ? {
                              ...currentTable,
                              status: previousStatus,
                          }
                        : currentTable
                )
            );

            setpopup("Could not change table status");
        }
    };

    return (
        <div className="mt-5 pr-5">
            {/* Header */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-[30px] font-semibold text-[#27221E]">
                        Table Management
                    </h1>

                    <p className="text-sm text-gray-600">
                        Add tables, manage seating capacity and
                        update table availability.
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="flex w-fit cursor-pointer items-center gap-2 rounded-[10px] bg-[#A13924] px-4 py-2 text-white transition hover:scale-[0.98]"
                >
                    <Plus size={20} strokeWidth={3} />
                    Add Table
                </button>
            </div>

            {/* Statistics */}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    title="Total Tables"
                    value={statistics.total}
                    icon={<Armchair size={20} />}
                />

                <StatCard
                    title="Available"
                    value={statistics.available}
                />

                <StatCard
                    title="Occupied"
                    value={statistics.occupied}
                />

                <StatCard
                    title="Reserved"
                    value={statistics.reserved}
                />

                <StatCard
                    title="Cleaning"
                    value={statistics.cleaning}
                />
            </div>

            {/* Search and filter */}

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
                <label className="relative block w-full max-w-sm">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7168]"
                    />

                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                        placeholder="Search table..."
                        className="w-full rounded-lg border border-[#dec0ba] bg-white py-2 pl-10 pr-3 text-sm text-[#28211e] outline-none transition placeholder:text-[#a58d85] focus:border-[#A13924] focus:ring-2 focus:ring-[#A13924]/15"
                    />
                </label>

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(
                            event.target
                                .value as StatusFilter
                        )
                    }
                    className="w-full rounded-lg border border-[#dec0ba] bg-white px-3 py-2 text-sm outline-none focus:border-[#A13924] md:w-48"
                >
                    <option value="All">
                        All Status
                    </option>

                    {Object.values(TableStatus).map(
                        (status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>
                        )
                    )}
                </select>

                <span className="rounded-full border border-[#dec0ba] bg-[#fff8f5] px-3 py-2 text-sm text-[#654f48]">
                    {filteredTables.length}{" "}
                    {filteredTables.length === 1
                        ? "table"
                        : "tables"}{" "}
                    found
                </span>
            </div>

            {/* Table cards */}

            {loading ? (
                <div className="mt-5 rounded-xl border border-[#dec0ba] bg-white px-5 py-12 text-center text-gray-500">
                    Loading tables...
                </div>
            ) : filteredTables.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-[#dec0ba] bg-white px-5 py-12 text-center text-gray-500">
                    No tables found
                </div>
            ) : (
                <div className="mt-5 grid grid-cols-1 gap-3 pb-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredTables.map((table, index) => (
                        <motion.article
                            key={table.id}
                            initial={{ opacity: 0, y: 18, scale: 0.96 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.15 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{
                                duration: 0.45,
                                delay: Math.min(index * 0.06, 0.36),
                                type: "spring",
                                stiffness: 130,
                                damping: 16,
                            }}
                            className="group relative overflow-hidden rounded-2xl border border-[#dec0ba] bg-white p-4 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-[#A13924] hover:shadow-xl motion-reduce:transition-none"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#A13924] via-[#d68163] to-[#f0c3b9]" />

                            <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff1ee] text-[#A13924] transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:scale-105 motion-reduce:transition-none">
                                        <Armchair size={23} strokeWidth={1.8} />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8b7168]">
                                            Table
                                        </p>
                                        <h2 className="truncate text-xl font-bold leading-6 text-[#28211e]">
                                            {table.tableno}
                                        </h2>
                                    </div>
                                </div>
                                <StatusBadge status={table.status} />
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <div className="rounded-xl bg-[#fcf7f4] px-3 py-2.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8b7168]">
                                        Seating
                                    </p>
                                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#413a34]">
                                        <Users size={15} className="text-[#A13924]" />
                                        {table.seatCapacity}{" "}
                                        {table.seatCapacity === 1 ? "seat" : "seats"}
                                    </div>
                                </div>
                                <div className="rounded-xl bg-[#fcf7f4] px-3 py-2.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8b7168]">
                                        Reservation
                                    </p>
                                    <p
                                        className={`mt-1 truncate text-sm font-semibold ${
                                            table.reservationId
                                                ? "text-[#8b6100]"
                                                : "text-[#9a8b84]"
                                        }`}
                                    >
                                        {table.reservationId
                                            ? "Reserved"
                                            : "None"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#ead9d4] pt-3">
                                <label
                                    className="sr-only"
                                    htmlFor={`table-status-${table.id}`}
                                >
                                    Change status for table {table.tableno}
                                </label>
                                <select
                                    id={`table-status-${table.id}`}
                                    value={table.status}
                                    onChange={(event) =>
                                        changeStatus(
                                            table,
                                            event.target.value as TableStatus,
                                        )
                                    }
                                    className="min-w-0 flex-1 rounded-lg border border-[#dec0ba] bg-white px-2.5 py-2 text-xs font-medium text-[#554742] outline-none transition-colors hover:border-[#A13924] focus:border-[#A13924] focus:ring-2 focus:ring-[#A13924]/10"
                                >
                                    {Object.values(TableStatus).map(
                                        (status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ),
                                    )}
                                </select>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => openEditForm(table)}
                                        aria-label={`Edit table ${table.tableno}`}
                                        className="rounded-lg p-2 text-[#A13924] transition-colors hover:bg-[#fff1ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A13924]"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => deleteTable(table)}
                                        aria-label={`Delete table ${table.tableno}`}
                                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
                    <div className="w-full max-w-md rounded-2xl border border-[#dec0ba] bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-[#27221E]">
                                    {editingTable
                                        ? "Edit Table"
                                        : "Add Table"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {editingTable
                                        ? "Update table number or seating capacity."
                                        : "Create a new restaurant table."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                                className="cursor-pointer rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 flex flex-col gap-4"
                        >
                            <label>
                                <span className="mb-1 block text-sm font-medium text-[#554742]">
                                    Table Number
                                </span>

                                <input
                                    type="number"
                                    min="1"
                                    value={form.tableno}
                                    onChange={(event) =>
                                        setForm(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                tableno:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    required
                                    placeholder="Example: 5"
                                    className="w-full rounded-lg border border-[#dec0ba] px-3 py-2 outline-none focus:border-[#A13924] focus:ring-2 focus:ring-[#A13924]/15"
                                />
                            </label>

                            <label>
                                <span className="mb-1 block text-sm font-medium text-[#554742]">
                                    Seat Capacity
                                </span>

                                <input
                                    type="number"
                                    min="1"
                                    value={
                                        form.seatCapacity
                                    }
                                    onChange={(event) =>
                                        setForm(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                seatCapacity:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    required
                                    placeholder="Example: 4"
                                    className="w-full rounded-lg border border-[#dec0ba] px-3 py-2 outline-none focus:border-[#A13924] focus:ring-2 focus:ring-[#A13924]/15"
                                />
                            </label>

                            <div className="mt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="cursor-pointer rounded-lg border border-[#dec0ba] px-4 py-2 text-sm text-[#554742] hover:bg-[#fcf7f4]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="cursor-pointer rounded-lg bg-[#A13924] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingTable
                                        ? "Update Table"
                                        : "Add Table"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --------------------------------------------------
// Small components used only by your Tables page
// --------------------------------------------------

function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon?: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-[#dec0ba] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-sm text-[#654f48]">
                    {title}
                </span>

                {icon && (
                    <span className="text-[#A13924]">
                        {icon}
                    </span>
                )}
            </div>

            <div className="mt-2 text-2xl font-bold text-[#27221E]">
                {value}
            </div>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: TableStatus;
}) {
    const styles: Record<TableStatus, string> = {
        [TableStatus.Available]:
            "bg-green-100 text-green-700",

        [TableStatus.Occupied]:
            "bg-red-100 text-red-700",

        [TableStatus.Reserved]:
            "bg-amber-100 text-amber-700",

        [TableStatus.Cleaning]:
            "bg-blue-100 text-blue-700",
    };

    return (
        <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}