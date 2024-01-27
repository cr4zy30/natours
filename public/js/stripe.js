import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51Oah5kJjtzOLpiWqcBrD1zuBuRn4MCmF3PhsJITN4RSJwaYc14b4o9HCdcoKBtWHIdNi7G3XpHfwsGJI3gXEGjJ500tZmLeWNq',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
