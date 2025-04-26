from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler

async def start(update: Update, context):
    await update.message.reply_text(
        "🎨 Откройте рисовалку:",
        reply_markup={"inline_keyboard": [[{"text": "Рисовать", "web_app": {"url": "https://drawww-app.vercel.app"}}]]}
    )

app = ApplicationBuilder().token("7575940912:AAGZadQi6Ua0T-WwL6uL4ZZY0trR_DTbnY8").build()
app.add_handler(CommandHandler("start", start))
app.run_polling()