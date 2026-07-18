import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (cake, quantity = 1, customizations = {}) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (item) => item.id === cake.id && JSON.stringify(item.customizations) === JSON.stringify(customizations)
        )

        if (existingIndex > -1) {
          const updated = [...items]
          updated[existingIndex].quantity += quantity
          set({ items: updated })
        } else {
          set({
            items: [...items, {
              id: cake.id,
              name: cake.name,
              price: cake.price,
              image: cake.image,
              quantity,
              customizations,
            }],
          })
        }
      },

      removeItem: (id, customizations = {}) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && JSON.stringify(item.customizations) === JSON.stringify(customizations))
          ),
        })
      },

      updateQuantity: (id, quantity, customizations = {}) => {
        if (quantity <= 0) {
          get().removeItem(id, customizations)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === id && JSON.stringify(item.customizations) === JSON.stringify(customizations)
              ? { ...item, quantity }
              : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'velvet-crumb-cart' }
  )
)

export default useCartStore
