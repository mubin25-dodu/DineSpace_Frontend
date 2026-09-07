"use client"
import { api } from "@/lib/api/axios";
import { resturantContext } from "@/lib/context/Context";
import Result from "@/lib/Result";
import { useContext, useEffect, useState } from "react";
import KPICard from "@/components/KPICards";
import { Edit, Landmark } from "lucide-react";
import { Wallet, WithdrawalRequest } from "@/lib/interfaces/wallet";
import { WithdrawalStatus, WithdrawalType } from "@/lib/Enums";
import { withdrawal, withdrawals } from "@/schemas/withdrawal.shcema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function WalletPage() {
    const {defaultResturant , setpopup} = useContext(resturantContext);
    const [walletData, setWalletData] = useState<Wallet | undefined>();
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<"date" | "status">("date");
    const [showbtn, setShowbtn] = useState(false);
    const [sortAscending, setSortAscending] = useState(false);
    const [disablewithdrawalbtn ,setdisablewithdrawalbtn] = useState(false);

    const form = useForm<withdrawals>({
        resolver: zodResolver(withdrawal),
        mode: "onBlur",
    });

    const getapi = async () => {
        try {
            if(!defaultResturant){return}
            setLoading(true);
            const walletResponse = await api.get<Result<Wallet>>(`wallet/wallet/${defaultResturant}`);
            const wallet = walletResponse.data.Data;
            console.log(walletResponse.data);
            if (walletResponse.data.Success && wallet) {

                if(wallet.withdrawalRequests && wallet.withdrawalRequests.length > 0){
                const withdrawalRequests = wallet.withdrawalRequests.filter(
                    (request: WithdrawalRequest) => request.type === WithdrawalType.Withdraw,
                );
                setWalletData({ ...wallet, withdrawalRequests });
                }
                else{
                    setWalletData(wallet);
                }

            }
        } catch (error) {
            console.error("Error fetching wallet data:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(()=>{
    getapi();
    },[defaultResturant]);

    const amount = walletData?.balance ? walletData.balance : 0;
    const pendingAmount = walletData?.withdrawalRequests?.filter((req) => req.status === WithdrawalStatus.Pending && req.type === WithdrawalType.Withdraw).reduce((total, request) => total + Number(request.amount), 0) || 0;
    const completedAmount = walletData?.withdrawalRequests?.filter((req) => req.status === WithdrawalStatus.Approved && req.type === WithdrawalType.Withdraw).reduce((total, request) => total + Number(request.amount), 0) || 0;
    
    const transactions = [...(walletData?.withdrawalRequests ?? [])].sort((first, second) => {
        const comparison = sortBy === "date"
            ? new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
            : first.status.localeCompare(second.status);

        return sortAscending ? comparison : -comparison;
    });

    const changeSort = (column: "date" | "status") => {
        if (sortBy === column) {
            setSortAscending((current) => !current);
        } else {
            setSortBy(column);
            setSortAscending(true);
        }
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const statusStyle = (status: string) => {
        const normalizedStatus = status.toLowerCase();
        if (normalizedStatus === WithdrawalStatus.Approved) {
            return "bg-[#e4f7ef] text-[#188260]";
        }
        if (normalizedStatus === WithdrawalStatus.Pending) {
            return "bg-[#fff1d9] text-[#bd7800]";
        }
        if (normalizedStatus === WithdrawalStatus.Rejected) {
            return "bg-[#f8d7da] text-[#721c24]";
        }
        if (normalizedStatus === WithdrawalStatus.Cancled) {
            return "bg-[#f8d7da] text-[#721c24]";
        }
        return "bg-[#eee9e7] text-[#6e625d]";
    };

 const handlewithdrawal = 
 async (payload: withdrawals) => {
        setdisablewithdrawalbtn(true);
        if(Number(pendingAmount) + Number(payload.amount) > Number(walletData?.balance)){
            setpopup("You don't have enough balance to make this withdrawal request.check your pending withdrawal requests and try again.");
            setdisablewithdrawalbtn(false);
            return;
        }
        try {
            payload.type = WithdrawalType.Withdraw;
            if(!payload){return};
            const response = await api.post<Result<string>>(`wallet/WidthdrawRequest/${defaultResturant}`, payload);
            if(response.data.Success){
                getapi();
            }
            setpopup(response.data.Message);
        } catch (error) {
            console.error("Error submitting withdrawal request:", error);
        } finally {
            setdisablewithdrawalbtn(false);
        }
    }

    const handlecancel = async(id:string , prestate:WithdrawalStatus)=>{
        const prevstate = prestate;
        setWalletData((prev)=>{
            if (!prev) return prev;
            return {
                ...prev,
                withdrawalRequests: prev.withdrawalRequests.map(e =>
                    e.id === id ? {...e, status: WithdrawalStatus.Cancled} : e,
                ),
            };
        });
        try{
            const {data} = await api.delete<Result<string>>(`wallet/withdrawal/${id}`);
            if(!data.Success){
            setWalletData((prev)=>{
                if (!prev) return prev;
                return {
                    ...prev,
                    withdrawalRequests: prev.withdrawalRequests.map(e =>
                        e.id === id ? {...e, status: prestate} : e,
                    ),
                };
            });
            }

        }catch(e){
            console.log(e);
            setWalletData((prev)=>{
                if (!prev) return prev;
                return {
                    ...prev,
                    withdrawalRequests: prev.withdrawalRequests.map(e =>
                        e.id === id ? {...e, status: prestate} : e,
                    ),
                };
            });
        }
    }

    return (<>
           <div className="flex flex-row items-center justify-between mr-5">
             <div className="mt-5 ">
                <h1 className="text-[30px] font-semibold">Wallet & Payments  <span className="text-[#A13924]">{new Date().toLocaleString("en-US", { year: "numeric" })}</span></h1>
                <p className="text-gray-600">Manage your resturants finances, refunds and transaction history</p>
            </div>
            <button className="h-fit hover:scale-95 flex flex-row w-fit gap-2 font-semibold rounded-[10px] bg-[#A13924] text-white p-3 duration-150"  onClick={() => {setShowbtn(!showbtn)}}>
                <Landmark color="#ffffff" size={20}/>Withdraw Funds
            </button>
        </div>
        <div className="flex flex-row gap-5 mt-5">
            <KPICard title="Current balance" amount={amount} subtitle={"BDT"} />
            <KPICard title="Pending withdrawal" amount={pendingAmount} subtitle={"BDT"} />
            <KPICard title="Completed withdrawal" amount={completedAmount} subtitle={"BDT"} />
        </div>
       
        <section className="mr-5 mt-8 overflow-hidden rounded-xl border border-[#dec0ba] bg-white">
            <div className="flex items-center justify-between border-b border-[#dec0ba] px-4 py-3">
                <div>
                <h2 className="text-lg font-medium text-[#28211e]">Transaction History</h2>
                 <span className="text-sm text-[#a13924] ">
            Note: For multiple withdrawal requests, the queue will be processed in the order they are received. and money will be deducted from your balance once the request is approved. You can cancel a pending request if you change your mind.
        </span>
        </div>
            </div>
            <div className="max-h-[42vh] overflow-x-auto overflow-y-auto">
                <table className="w-full min-w-[720px] text-left text-xs">
                    <thead className="sticky top-0 z-10 border-b border-[#ead9d4] bg-white text-[11px] text-[#654f48]">
                        <tr>
                            <th className="px-3 py-3 font-medium"><button type="button" onClick={() => changeSort("date")} className="group inline-flex items-center gap-2 hover:text-[#a13924]"><span>Date</span><span className="inline-flex items-center gap-1 rounded-full bg-[#f3efed] px-2 py-0.5 text-[10px] font-medium text-[#8b7168] group-hover:bg-[#ead9d4] group-hover:text-[#a13924]"><span>{sortAscending ? "↑" : "↓"}</span>{sortBy === "date" ? (sortAscending ? "Oldest" : "Newest") : "Sort"}</span></button></th>
                            <th className="px-3 py-3 font-medium">Reference</th>
                            <th className="px-3 py-3 font-medium">Type</th>
                            <th className="px-3 py-3 font-medium">Payment method</th>
                            <th className="px-3 py-3 font-medium">Account</th>
                            <th className="px-3 py-3 font-medium"><button type="button" onClick={() => changeSort("status")} className="group inline-flex items-center gap-2 hover:text-[#a13924]"><span>Status</span><span className="inline-flex items-center gap-1 rounded-full bg-[#f3efed] px-2 py-0.5 text-[10px] font-medium text-[#8b7168] group-hover:bg-[#ead9d4] group-hover:text-[#a13924]"><span>{sortAscending ? "↑" : "↓"}</span>{sortBy === "status" ? (sortAscending ? "A-Z" : "Z-A") : "Sort"}</span></button></th>
                            <th className="px-3 py-3 text-right font-medium">Amount</th>
                            <th className="px-3 py-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={7} className="px-3 py-8 text-center text-[#8b7168]">Loading transactions...</td></tr> : transactions.length === 0 ? <tr><td colSpan={7} className="px-3 py-8 text-center text-[#8b7168]">No transactions found.</td></tr> : transactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b border-[#f0e8e5] last:border-0 hover:bg-[#fffaf8]">
                                <td className="px-3 py-3 text-[#28211e]">{formatDate(transaction.createdAt)}<span className="block text-[10px] text-[#8b7168]">{new Date(transaction.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span></td>
                                <td className="px-3 py-3 font-mono text-[10px] text-[#6e625d]">{transaction.id == null? "N/A" : transaction.id.slice(0, 12)}</td>
                                <td className="px-3 py-3 capitalize text-[#28211e]">{transaction.type}</td>
                                <td className="px-3 py-3 capitalize text-[#28211e]">{transaction.paymentMethod}</td>
                                <td className="px-3 py-3 text-[#28211e]">{transaction.accountNumber}</td>
                                <td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-medium capitalize ${statusStyle(transaction.status)}`}>{transaction.status}</span></td>
                                <td className="px-3 py-3 text-right font-semibold text-[#28211e]">৳{Number(transaction.amount).toLocaleString("en-US")}</td>
                                <td className="px-3 py-3 text-right">
                                    {transaction.status === WithdrawalStatus.Pending && (
                                        <button className="rounded-lg border border-[#A13924] px-3 py-1.5 text-xs font-semibold text-[#A13924] transition-colors hover:bg-[#A13924] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A13924]"
                                        title="Cancel this withdrawal request"
                                        onClick={() => {
                                            handlecancel(transaction.id , transaction.status)
                                        }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
       { showbtn && (
            <form onSubmit={form.handleSubmit(handlewithdrawal)} className="mt-8 fixed top-15 right-60 flex flex-col gap-3 rounded-xl border border-[#dec0ba] bg-white p-5 w-fit">
                <span className="flex flex-row gap-4">
                <span className="flex flex-col gap-1">
                <label htmlFor="accountNumber">Account Number</label>
                <input type="number"  className="border border-[#dec0ba] focus:outline-none focus:ring-2 focus:ring-[#A13924]" {...form.register('accountNumber')} />
                {form.formState.errors.accountNumber && (
                        <span className={`text-red-500 text-sm`}>{form.formState.errors.accountNumber.message as string}</span>
                    )}
                </span>
            <span className="flex flex-col gap-1">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select  id="paymentMethod" className="border border-[#dec0ba] focus:outline-none focus:ring-2 focus:ring-[#A13924]" {...form.register('paymentMethod')}>
                <option  value="">Select Method</option>
                <option value="bkash">Bkash</option>
                <option value="nagad">Nagad</option>
                <option value="upay">Upay</option>
            </select>
            {form.formState.errors.paymentMethod && (
                        <span className={`text-red-500 text-sm`}>{form.formState.errors.paymentMethod.message as string}</span>
                    )}
            </span>
            <input type="hidden" value={WithdrawalType.Withdraw} {...form.register('type')} />
            </span>
            <label htmlFor="amount">Amount</label>
            <input max={walletData?.balance} type="number" id="amount" className="border border-[#dec0ba] focus:outline-none focus:ring-2 focus:ring-[#A13924]" {...form.register('amount', { valueAsNumber: true })} />
            {form.formState.errors.amount && (
                        <span className={`text-red-500 text-sm`}>{form.formState.errors.amount.message as string}</span>
                    )}
            <button type="submit" className="rounded-lg bg-[#A13924] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#8a2c1d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A13924] hover:scale-95 duration-250 cursor-pointer"  disabled = {disablewithdrawalbtn}>
                {disablewithdrawalbtn && <span className="loading loading-spinner mr-1"></span>}
                Request Withdrawal
            </button>
        </form>)}
    </>);
}
