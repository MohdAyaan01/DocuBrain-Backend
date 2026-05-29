import  Ollama from "ollama";

export const GenerateOllamaSummary = async(text:string) => {
    try{
        const reponse = await Ollama.generate({
            model: 'tinyllama',
            prompt:`Summarize the following text accurately: \n\n${text}`
        })
        return reponse.response;
    }catch(error){
        console.error("Ollama Generation Failed",error);
        throw error
    }
}