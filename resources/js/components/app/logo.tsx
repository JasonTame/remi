import type React from "react";

export function AppLogo(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 220 160"
			aria-labelledby="app-logo-title"
			role="img"
			{...props}
		>
			<title id="app-logo-title">App Logo</title>
			<path
				d="M190,130h-15c0-30-11.526075-46.5-18.52115-47-25,0-4.47885,57-29.47885,57s-10-30-40-30-15,30-40,30C17,140,7,45,87,40c-1,4-1,8-1,12c0,5,1,10,3,15s5,9,9,12c2,1.5,4,3,7,4s5,1,8,.5s5-1.5,7-3s4-3,5-5c-15,18-35,2-35-25c0-4,.5-7.5,1.5-10.5c6-18,28-17,35-4c79.544629,44.5,63.5,68.490895,63.5,94Z"
				fill="#607d8b"
			/>
			<path
				d="M45,85q-10-5-20,0-5,3,0,7q5,3,10-2"
				transform="translate(8.348171-18.355151)"
				fill="#607d8b"
				stroke="#607d8b"
				stroke-width="3"
				stroke-linecap="round"
			/>
			<circle r="3.5" transform="translate(135 55)" fill="#fff" />
		</svg>
	);
}
