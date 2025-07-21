"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react'

function HealthCheck() {
    const [status, setStatus] = useState<string>("loading");

    useEffect(() => {
        async function fetchHealthStatus() {
            try {
                const response = await axios.get('/api/healthcheck');
                const data = response.data;
                setStatus(data.status);
            } catch (error) {
                console.error("Error fetching health status:", error);
                setStatus("error");
            }
        }
        fetchHealthStatus();
    }, []);

    return (
        <div>
            <h1>Health Check</h1>
            <p>This page is used to check the health of the application.</p>
            <p>You can use this endpoint to ensure that the server is running properly.</p>
            <p>Make a GET request to /api/healthcheck to see the status.</p>
            <h2>Healthcheck Status: {status}</h2>
        </div>
    )
}

export default HealthCheck;
