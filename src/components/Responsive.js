import { Grid, ResponsiveContext} from 'grommet'
import React from 'react'

const ResponsiveGrid = ({children, areas, ...props}) => {
    const size = React.useContext(ResponsiveContext);
    return(
        <Grid areas ={areas[size]} {...props}>{children}</Grid>
    )
}

export default ResponsiveGrid;
