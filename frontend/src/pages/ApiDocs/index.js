import React, { useEffect } from "react";
import openSocket from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(1)
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		alignItems: "center",
	},

	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	},
}));


const ApiDocs = () => {
	const classes = useStyles();

	useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL);
		return () => {
			socket.disconnect();
		};
	}, []);

    const back = process.env.REACT_APP_BACKEND_URL;
    const endapi = "/api-docs";
    const urlapi = back.concat(endapi);

    return (
        
		<div className={classes.root}> 
		  
		</div>
	);
};

export default ApiDocs;