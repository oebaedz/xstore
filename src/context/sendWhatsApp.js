import supabase from "../components/createClient"

const sendWhatsApp = async (targetNumber, messageText) => {
    const { data, error } = await supabase.functions.invoke('sendwhatsapp', {
        body: {
            target: targetNumber,
            message: messageText
        }
    })

    if (error) {
        console.error('Error invoking function:', error)
        return { success: false, error }
    }
    return { success: true, data }
}

export default sendWhatsApp;