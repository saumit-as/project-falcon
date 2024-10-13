import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
// import JSON5 from 'json5'
import "./index.css"
import { Button } from "./components/ui/button";
import { checkIfDBExist } from "./dbActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

function Options() {
	const [payload, setPayloadData] = useState("")
	const [payloadName, setPayloadName] = useState("")

	useEffect(() => {
		checkIfDBExist()
	}, [])

	const formatPayload = async () => {
		// setPayloadData((data) => JSON.stringify(JSON5.parse(data), null, 2))
	}


	return (
		<div className="App">
			<div className="flex gap-5">
				<Select>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Theme" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="light">Light</SelectItem>
						<SelectItem value="dark">Dark</SelectItem>
						<SelectItem value="system">System</SelectItem>	
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

const index = document.createElement("div");
index.id = "options";
document.body.appendChild(index);

ReactDOM.createRoot(index).render(
	<Options />
);



