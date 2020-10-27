import React, { useState } from 'react';
import { gql, Reference, useMutation } from '@apollo/client';

import Button from '../components/button';
import * as LaunchDetailsTypes from '../pages/__generated__/LaunchDetails';
import { cartItemsVar } from '../cache';


export const CANCEL_TRIP = gql`
  mutation cancel($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

interface ActionButtonProps extends Partial<LaunchDetailsTypes.LaunchDetails_launch> {}

const CancelTripButton: React.FC<any> = ({ id }) => {
  const [mutate, { loading, error }] = useMutation(
    CANCEL_TRIP,
    {
      variables: { launchId: id},
      update(cache, { data: { cancelTrip } }) {
        const launch = cancelTrip.launches[0];
        cache.modify({
          id: `User:${localStorage.getItem('userId')}`,
          fields: {
            trips(existingTrips) {
              const launchRef = cache.writeFragment({
                data: launch,
                fragment: gql`
                  fragment RemoveLaunch on Launch {
                    id
                  }
                `
              });
              return existingTrips.filter(
                (tripRef: Reference) => tripRef === launchRef
              )
            }
          }
        })
      }
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <div>
      <Button
        onClick={() => mutate()}
        data-testid={'action-button'}
      >
        Cancel This Trip
      </Button>
    </div>
  );
}

const ToggleTripButton: React.FC<ActionButtonProps> = ({ id }) => {
  const cartItems = cartItemsVar();
  const isInCart = id ? cartItems.includes(id) : false;
  const [, toggleTrip] = useState(isInCart);
  return (
    <div>
      <Button
        onClick={() => {
          if (id) {
            cartItemsVar(
              isInCart
                ? cartItems.filter((i) => i !== id)
                : [...cartItems, id]
            );
          }
          toggleTrip(!isInCart);
        }}
        data-testid={'action-button'}
      >
        {isInCart ? 'Remove from Cart' : 'Add to Cart'}
      </Button>
    </div>
  );
}

const ActionButton: React.FC<ActionButtonProps> = 
  ({ isBooked, id }) => (
    isBooked ? <CancelTripButton id={id} /> : <ToggleTripButton id={id} />
  )

export default ActionButton;