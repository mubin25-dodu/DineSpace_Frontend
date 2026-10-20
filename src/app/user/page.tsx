"use client"
import LatticeLoader from "@/components/LatticeLoader/LetticalLoader";
import { UserHeroPhone , UserHeroDesktop } from "@/components/userComponents/hero"
import RestaurantCard from "@/components/userComponents/restaurantcard";
import { api } from "@/lib/api/axios";
import { userContext } from "@/lib/context/Context";
import { Restaurant } from "@/lib/interfaces/order"
import Result from "@/lib/Result";
import { Search, Utensils, X } from "lucide-react";
import { useContext, useEffect, useState } from "react"
import { motion } from "motion/react";
export default function User() {
    
    const [restaurants , setrestaurants] = useState<Restaurant[]>();
    const { setNavinfo, setservererror } = useContext(userContext);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const filteredRestaurants = restaurants?.filter((restaurant) =>
        restaurant.resturantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // const [windowWidth, setWindowWidth] = useState(0);

    // useEffect(() => {
    //     const handleResize = () => {
    //         setWindowWidth(window.innerWidth);
    //     };
    //     window.addEventListener('resize', handleResize);
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);

    useEffect(() => {
        setNavinfo({ icon1: <Utensils color="#A13924" />, title: "DineSpace" });
    }, [setNavinfo]);

    useEffect(() => {
        const getrestaurants = async () => {
            try {
                const {data} = await api.get<Result<Restaurant[]>>("resturant/getAllResturants");
                // console.log(data);
                if (data?.Success) {
                    setrestaurants(data.Data ?? []);
                }
            } catch (error) {
                console.error("Failed to fetch restaurants", error);
                setservererror("Failed to load restaurants. Please try again.");
            }
        };

        getrestaurants();
    }, []);

    return (
      <>
        <span className="block sm:hidden">
          <UserHeroPhone />
        </span>
        <span className="hidden lg:block">
          <UserHeroDesktop />
        </span>

        <section className="px-4 pb-8 pt-10 sm:px-6 sm:pt-14 lg:px-0">
          <div className="max-w-5xl">
            <h2 className="text-3xl font-semibold tracking-tight text-[#291812] sm:text-4xl">
              Browse restaurants
            </h2>
            <motion.p className="mt-2 text-base text-[#6d514b]">
              Find a place for your next meal.
            </motion.p>
            <motion.div
              viewport={{ once: true }}
              initial={{  width: 60 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1, type: "spring" }}
          
              className="mt-6 flex h-14 w-full max-w-2xl items-center gap-3 rounded-2xl border border-[#e8d7ce] bg-white px-4 transition focus-within:border-[#A13924] focus-within:ring-4 focus-within:ring-[#A13924]/10"
            >
              <Search
                size={20}
                className="shrink-0 text-[#A13924]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search restaurants by name"
                className="h-full min-w-0 flex-1 bg-transparent text-base text-[#291812] outline-none placeholder:text-[#9a8178]"
                placeholder="Search by restaurant name"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear restaurant search"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#806f6b] transition hover:bg-[#f8efe7] hover:text-[#291812] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A13924]"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              )}
            </motion.div>
          </div>
        </section>

        {filteredRestaurants && filteredRestaurants.length > 0 ? (
          <>
            <div className="flex flex-row px-4 sm:px-6 lg:px-0">
              <motion.p
                initial={{ x: -50, opacity: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileInView={{ x: 0, opacity: 1 }}
                aria-live="polite"
                className="text-[#6d514b]"
              >
                Showing {filteredRestaurants.length}{" "}
                {filteredRestaurants.length === 1
                  ? "restaurant"
                  : "restaurants"}
              </motion.p>
            </div>
            <motion.span className="mx-4 mb-10 mt-4 flex min-h-[50vh] flex-row flex-wrap justify-center gap-5 sm:mx-6 lg:mx-0">
              {filteredRestaurants?.map((restaurant) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ x: 24, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.01 }}
                  className="w-full flex-none sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
                >
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                </motion.div>
              ))}
            </motion.span>
          </>
        ) : restaurants ? (
          <div className="mx-4 mb-12 flex min-h-52 flex-col items-center justify-center px-4 text-center sm:mx-6 lg:mx-0">
            <p className="text-lg font-semibold text-[#291812]">
              {searchQuery
                ? "No restaurants match your search"
                : "No restaurants to show yet"}
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#6d514b]">
              {searchQuery
                ? "Try another restaurant name or clear your search."
                : "Please check back soon."}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 rounded-xl bg-[#A13924] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#842f1e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A13924]"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <span className="flex items-center min-h-50 justify-center">
            <LatticeLoader
              status="working"
              label="Loading restaurants..."
              doneLabel="Done in"
              errorLabel="Failed after"
              pattern="arrow"
              grid={3}
              shape="round"
              doneColor="#22c55e"
              errorColor="#ef4444"
              cellSize={6}
              gap={2}
              fontSize={14}
              step={90}
              idleOpacity={0.15}
              glow={false}
              glowColor="#f5f5f5"
              showTimer
              color="#A13924"
            />
          </span>
        )}
      </>
    );
}
