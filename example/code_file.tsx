// @ts-nocheck
import React from "react";
import { RenderCountTestComponent } from "@forms/editor/test/RenderCount/RenderCountTest";
import { RenderCountTestComponent2 } from "@forms/editor/test/RenderCount/RenderCountTest2";
export default function TestForm() {
	return (
		<div className="container mx-auto mt-8">
			<h1 className="mb-4 text-2xl font-bold">Render Count Test Page</h1>
			{/* <RenderCountTestComponent /> */}
			<RenderCountTestComponent2 />
		</div>
	);
}
