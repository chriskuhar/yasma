import { configureStore } from '@reduxjs/toolkit'
import mailboxReducer from '@/features/mail/mailboxSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      mailbox: mailboxReducer,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
