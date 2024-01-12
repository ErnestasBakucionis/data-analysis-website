import React from 'react';

function Regression() {
    const clientCsvFile = '/sample_data.csv';

    return (
        <div className="container mx-auto p-6">
            <div>
                <h2 className="text-2xl font-semibold mb-4">What our templates consist of?</h2>
                <h3 className="text-xl font-semibold mb-4">Client CSV Template</h3>
                <p className="mb-4">
                    This CSV file should contain the following columns: ID, Name, Surname, Email, Address, Phone Number.
                    Each row in this CSV represents a client, with a unique ID, and includes their contact information.
                </p>
                <div>
                    <a href={clientCsvFile} download className="text-blue-600 hover:underline">
                        Download Client Template Example
                    </a>
                </div>
                <h3 className="text-xl font-semibold mb-4">Order CSV Template</h3>
                <p className="mb-4">
                    The order CSV should have columns for ID, Order Date, Total Amount,
                    Client ID, Delivery Status. Each row represents an individual
                    order made by a client, linked via the Client ID.
                </p>
                <h3 className="text-xl font-semibold mb-4">Product CSV Template</h3>
                <p className="mb-4">
                    This CSV should have the following columns: ID, Name, Description, Price, Category ID.
                    Each product is identified by a unique ID and linked to a category.
                </p>
                <h3 className="text-xl font-semibold mb-4">Category CSV Template</h3>
                <p className="mb-4">
                    The category CSV should include ID, Name, Description.
                    Each category has a unique ID and contains products.
                </p>
                <h3 className="text-xl font-semibold mb-4">Order Line Item CSV Template</h3>
                <p className="mb-4">
                    This file bridges orders and products.
                    It should have columns for ID, Order ID, Product ID, Quantity, Unit Price.
                    Each row links a product to an order and specifies the quantity and price per unit.
                </p>
                <h2 className="text-2xl font-semibold mb-4">How to Use Our Template</h2>
                <hr className="mb-8" />
            </div>
        </div>
    );
}

export default Regression;
