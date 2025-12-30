"use client";

import { useState } from "react";
import { Search, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { hsCodes } from "../data/hs_codes";

export default function HSCodeSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(hsCodes);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase();
        setQuery(val);
        if (val.length === 0) {
            setResults(hsCodes);
            return;
        }
        const filtered = hsCodes.filter(item =>
            item.description.toLowerCase().includes(val) ||
            item.code.includes(val) ||
            item.category.toLowerCase().includes(val)
        );
        setResults(filtered);
    };

    return (
        <section className="w-full max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Package className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">HS Code Detective</h2>
                    <p className="text-xs text-slate-400">Find the right customs code to avoid seizures.</p>
                </div>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search product (e.g. 'Cotton Shirt', 'Laptop', 'iPhone')..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={query}
                    onChange={handleSearch}
                />
            </div>

            {/* RESULTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {results.length > 0 ? (
                    results.map((item) => (
                        <div key={item.code} className="bg-slate-800/40 border border-white/5 p-4 rounded-xl hover:bg-slate-800/60 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-slate-700 text-white text-xs font-mono py-1 px-2 rounded">
                                    {item.code}
                                </span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${item.risk_level === "High" ? "bg-red-500/10 text-red-400" :
                                        item.risk_level === "Medium" ? "bg-orange-500/10 text-orange-400" :
                                            "bg-green-500/10 text-green-400"
                                    }`}>
                                    {item.risk_level} Risk
                                </span>
                            </div>
                            <h4 className="text-white font-semibold text-sm mb-1">{item.description}</h4>
                            <p className="text-xs text-slate-500 mb-3">{item.category}</p>

                            <div className="flex gap-2 text-[10px] font-mono border-t border-white/5 pt-2 mt-2">
                                <div className="flex-1">
                                    <span className="text-slate-500 block">US Duty</span>
                                    <span className="text-white">{item.duty_us}</span>
                                </div>
                                <div className="flex-1 border-l border-white/5 pl-2">
                                    <span className="text-slate-500 block">EU Duty</span>
                                    <span className="text-white">{item.duty_eu}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-8 text-center text-slate-500">
                        No HS Codes found for "{query}".
                    </div>
                )}
            </div>
        </section>
    );
}
