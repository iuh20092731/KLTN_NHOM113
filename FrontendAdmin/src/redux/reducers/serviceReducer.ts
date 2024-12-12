const initialState = {
    services: [],
};

const serviceReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SET_SERVICES':
            return {
                ...state,
                services: action.payload,
            };
        default:
            return state;
    }
};

export default serviceReducer; 