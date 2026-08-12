import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import ItemModal from './ItemModal';
import { BUSINESS } from '../App';

export default function MenuSection() {
  const { formatPrice } = useCurrency();
  const { isDark } = useTheme();
  const [categories, setCategories] = useState(['Todos', 'Hamburguesas', 'Perros Calientes', 'Combos & Papas', 'Bebidas']);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, [activeCategory]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const slug = BUSINESS.slug;
      const catParam = activeCategory !== 'Todos' ? `&category=${encodeURIComponent(activeCategory)}` : '';
      const res = await fetch(`/api/menu?business_slug=${slug}${catParam}`);
      const data = await res.json();
      if (data.items) setMenuItems(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="menu" className="py-6 sm:py-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6">
        <div>
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-orange-500 block mb-1">
            MENÚ ARTESANAL 100% ONLINE
          </span>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Nuestras Especialidades
          </h2>
        </div>

        {/* Category Pills - Horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 flex-shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-600/30'
                    : isDark 
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white' 
                      : 'bg-zinc-100 border border-zinc-300 text-zinc-700 hover:text-zinc-900'
                }`}
              >
                {cat === 'Hamburguesas' && <span>🍔</span>}
                {cat === 'Perros Calientes' && <span>🌭</span>}
                {cat === 'Combos & Papas' && <span>🍟</span>}
                {cat === 'Bebidas' && <span>🥤</span>}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className={`h-72 sm:h-80 rounded-2xl sm:rounded-3xl animate-pulse border ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
            }`} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {menuItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className={`rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col border transition-all duration-300 group ${
                isDark 
                  ? 'bg-zinc-950 border-zinc-800 hover:border-orange-500/50' 
                  : 'bg-white border-zinc-200 hover:border-orange-500/60 shadow-md'
              }`}
            >
              {/* Item Image */}
              <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-zinc-900 flex-shrink-0">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {item.badge && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                    {item.badge}
                  </span>
                )}

                <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-xl border border-zinc-700/80">
                  <span className="text-amber-400 font-black text-sm">{formatPrice(item.price_usd)}</span>
                </div>
              </div>

              {/* Item Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className={`font-black text-base sm:text-lg group-hover:text-orange-500 transition line-clamp-2 leading-snug ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}>
                    {item.name}
                  </h3>
                  <p className={`text-xs line-clamp-2 sm:line-clamp-3 leading-relaxed font-normal mt-1 ${
                    isDark ? 'text-zinc-300' : 'text-zinc-600'
                  }`}>
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedItemForModal(item)}
                  className={`w-full font-black py-3 px-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-xs transition-all active:scale-95 ${
                    isDark 
                      ? 'bg-zinc-900 hover:bg-orange-600 hover:text-white border border-zinc-700 text-orange-400' 
                      : 'bg-orange-50 hover:bg-orange-600 hover:text-white border border-orange-200 text-orange-600'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Personalizar y Agregar</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {selectedItemForModal && (
        <ItemModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
        />
      )}

    </section>
  );
}
