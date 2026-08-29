//oof-app/lib/email.ts
import * as MailComposer from "expo-mail-composer";

export async function draftEmail(item: any, store: any, flyerPrice: number) {
  const subject = `Price Match Request: ${item.name}`;
  const body = `
Hi ${store.name} Team,

I purchased ${item.name} for $${item.price} on ${new Date().toLocaleDateString()}.

I noticed your current flyer has it for $${flyerPrice}. I've attached my receipt.

Please honor the price adjustment.

Thanks!
  `;
  
  await MailComposer.composeAsync({
    subject,
    body,
    recipients: [store.customerEmail],
    attachments: [item.receiptPhotoUri], // From the receipt
  });
}