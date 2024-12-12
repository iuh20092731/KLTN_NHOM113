const initialState = {
    currentAdvertisement: null,
};

const advertisementReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SET_CURRENT_ADVERTISEMENT':
            return {
                ...state,
                currentAdvertisement: action.payload,
            };
        default:
            return state;
    }
};

export default advertisementReducer; 