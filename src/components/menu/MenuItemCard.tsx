'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MenuItem } from '@/lib/mockData';
import { useCartStore } from '@/store/cartStore';
import { useSystemStore } from '@/store/systemStore';
import { Plus, Heart } from 'lucide-react';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useToastStore } from '@/store/toastStore';

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

export const MenuItemCard = ({ item, index }: MenuItemCardProps) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const { isOpen } = useSystemStore();

  const cartItem = items.find(i => i.id === item.id);
  const cartQuantity = cartItem?.quantity || 0;
  
  const { favoriteIds, toggleFavorite } = useFavoriteStore();
  const { addToast } = useToastStore();
  const isFav = favoriteIds.includes(item.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
    if (!isFav) {
      addToast(`${item.name} added to favorites ❤️`, 'success');
    } else {
      addToast(`${item.name} removed from favorites`, 'default');
    }
  };

  const handleAdd = () => {
    if (!item.isAvailable || !isOpen) return;
    if (cartQuantity > 0) {
      updateQuantity(item.id, cartQuantity + 1);
    } else {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl
      });
      addToast(`${item.name} added to cart 🛒`, 'success');
    }
  };
  
  const handleRemove = () => {
    if (cartQuantity > 1) {
      updateQuantity(item.id, cartQuantity - 1);
    } else {
      removeItem(item.id);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: (index % 10) * 0.05, duration: 0.4 }}
      className={`relative group rounded-2xl overflow-hidden bg-[#15151a] border border-white/5 transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-xl flex flex-col ${!item.isAvailable ? 'opacity-60 grayscale-[50%]' : ''}`}
    >
      <div className="relative h-[120px] md:h-[160px] w-full overflow-hidden bg-white/5 flex items-center justify-center">
        {/* Full image visibility with contain */}
        <button 
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 active:scale-95"
        >
          <Heart className={`w-5 h-5 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-white/80 hover:text-white'}`} />
        </button>
        <img 
          src={item.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600'} 
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600'; }}
          alt={item.name} 
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />
        
        {/* Veg Badge */}
        {item.isVeg && (
          <div className="absolute top-3 left-3 z-20 bg-white/10 backdrop-blur-md p-1.5 rounded flex items-center justify-center border border-white/20">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
          </div>
        )}
        
        {/* Tags */}
        <div className="absolute top-14 right-3 z-20 flex flex-col gap-2 items-end">
          {item.tags?.map(tag => (
            <span key={tag} className={`px-2.5 py-0.5 text-xs font-bold rounded-md shadow-lg ${tag === 'Bestseller' ? 'bg-primary text-white' : tag === 'Hot' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
              {tag}
            </span>
          ))}
        </div>

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center backdrop-blur-[2px]">
            <span className="px-5 py-2 bg-black/80 border border-white/10 text-white font-bold rounded-xl text-sm uppercase tracking-widest shadow-xl">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-2 md:p-3 flex flex-col flex-1 bg-transparent">
        <div className="flex justify-between items-start mb-0.5 gap-1">
          <h3 className="font-bold text-sm md:text-base text-white leading-tight line-clamp-1">{item.name}</h3>
        </div>
        <div className="font-bold text-xs md:text-sm text-primary mb-1">₹{item.price}</div>
        <p className="text-muted-foreground text-[10px] md:text-xs flex-1 mb-3 line-clamp-2 leading-tight">
          {item.description}
        </p>

        {cartQuantity > 0 ? (
            <div className="w-full h-8 md:h-10 flex items-center justify-between bg-primary/20 border border-primary/30 rounded-lg overflow-hidden text-white font-medium">
              <button onClick={handleRemove} className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-primary/30 transition-colors text-sm md:text-base">-</button>
              <span className="flex-1 text-center font-bold text-sm md:text-base">{cartQuantity}</span>
              <button onClick={handleAdd} className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-primary/30 transition-colors text-sm md:text-base">+</button>
            </div>
         ) : (
           <button
             onClick={handleAdd}
             disabled={!item.isAvailable || !isOpen}
             className={`w-full h-8 md:h-10 rounded-lg font-bold flex items-center justify-center gap-1 transition-all duration-300 text-[10px] md:text-xs ${
               item.isAvailable && isOpen
                 ? 'bg-white/10 border border-white/5 hover:bg-primary hover:border-primary hover:text-white text-white'
                 : 'bg-white/5 text-white/30 cursor-not-allowed border border-transparent'
             }`}
           >
             {isOpen ? <><Plus className="w-3 h-3" /> Add</> : 'Closed'}
           </button>
         )}
       </div>
     </motion.div>
  );
};
