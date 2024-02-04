import Reverso from 'reverso-api';

const reverso = new Reverso();

export async function getContext(text: string, source: string, target: string): Promise<ReversoResponse> {
  try {
    const response = await reverso.getContext(text, source, target);
    return response;
  } catch (error) {
    throw error;
  }
}