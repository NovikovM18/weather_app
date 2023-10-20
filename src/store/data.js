const selectedCities = JSON.parse(localStorage.getItem('selectedCities'));

const initialState = {
	selectedCities: selectedCities || []
}
  
export const data = {
	state: initialState,
	actions: {
		addToSelectedCities(context, payload) {
      context.commit('ADD_TO_SELECTED_CITIES', payload);
		},
		delFromSelectedCities(context, payload) {
      context.commit('DEL_FROM_SELECTED_CITIES', payload);
		},
    
	},
	mutations: {
    ADD_TO_SELECTED_CITIES(state, payload) {
			if (state.selectedCities.length < 5) {
				state.selectedCities.push(payload);
				localStorage.setItem('selectedCities', JSON.stringify(state.selectedCities));
			} else {
				alert('no more 5 cities!')
			};
		},
		DEL_FROM_SELECTED_CITIES(state, payload) {
			state.selectedCities = state.selectedCities.filter((el) => {return el !== payload});
      localStorage.setItem('selectedCities', JSON.stringify(state.selectedCities));
		},
		
	}
}
  