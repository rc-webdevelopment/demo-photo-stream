import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { gql, useQuery } from '@apollo/client';

import { LAUNCH_TILE_DATA } from './launches';
import { Loading, Header, LaunchDetail } from '../components';
import * as LaunchDetailsTypes from './__generated__/LaunchDetails';
import { ActionButton } from '../containers';

export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      # isInCart @client
      site
      rocket {
        type
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchProps extends RouteComponentProps {
  launchId?: any;
}

const Launch: React.FC<LaunchProps> = ({ launchId }) => {
  const {
    data,
    loading,
    error,
  } = useQuery<
    LaunchDetailsTypes.LaunchDetails,
    LaunchDetailsTypes.LaunchDetailsVariables
  >(
    GET_LAUNCH_DETAILS,
    { variables: { launchId }},
  );

  if (loading) return <Loading />;
  if (error) {
    console.error(error);
    
    
    return <p>ERROR: {error.message}</p>;
  }
  if (!data) {
    console.log("... data: ", data);
    
    return <p>Not found</p>;
  }

  return (
    <>
      <Header
        image={
          data.launch && data.launch.mission &&
          data.launch.mission.missionPatch
        }
      >
        { data && data.launch && data.launch.mission &&
          data.launch.mission.name}
      </Header>
      <LaunchDetail {...data.launch}/>
      <ActionButton {...data.launch} />
    </>
  );
}

export default Launch;
