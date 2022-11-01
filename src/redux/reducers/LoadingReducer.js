export const LoadingReducer = (prevState = {
  isLoading: true
}, action) => {
  let { type, payload } = action

  switch (type) {
    case 'change_loading':
      let newstate = { ...prevState }
      newstate.isLoading = payload
      return newstate
    default:
      return prevState
  }
}