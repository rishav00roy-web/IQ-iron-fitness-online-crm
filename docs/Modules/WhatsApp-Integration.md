# WhatsApp Integration

This module manages all outbound communication with gym members through WhatsApp.

## 1. Single Member Messaging (Broadcast)
Clicking the WhatsApp pill next to a member's name opens a modal with three predefined template options:
- **Expiry Reminder:** Alerts the member that their plan has ended.
- **Dues Reminder:** Automatically injects the member's pending balance into the message.
- **General Greeting:** A friendly custom message.

Selecting a template opens the native `wa.me` deep link, pushing the text to the WhatsApp app.

## 2. Automated PDF Receipt Delivery (Bill Maker)
Clicking the "Receipt" icon in the table generates a professional, gym-branded PDF invoice on the client side using `html2pdf.js`. 
- The PDF is automatically downloaded to the user's phone or computer.
- A `wa.me` deep link is simultaneously triggered with a pre-filled message: *"Hi [Name], please find attached the receipt for your gym membership fee. Thank you!"*.
- The gym admin can then simply attach the downloaded PDF in the WhatsApp chat and send it.

## 3. Broadcast All
Clicking the "Broadcast" button in the header opens a dialog that maps over all members who have a phone number. It currently provides a list of `wa.me` links for the admin to click through and send bulk updates manually.
