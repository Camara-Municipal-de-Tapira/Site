package cmtapira.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import cmtapira.client.SaplClient;
import cmtapira.dto.MateriaDTO;
import cmtapira.dto.SessaoDTO;

@Service
public class ReuniaoService {
    
    private final SaplClient saplClient;

    public ReuniaoService(SaplClient saplClient) {
        this.saplClient = saplClient;
    }

    public List<SessaoDTO> buscarSessoes(String tipo, String ano, String mes, String dia) {
        // Lógica para buscar sessões usando o saplClient e converter para SessaoDTO
        Map<String, Object> response = saplClient.buscarSessoes(tipo, ano, mes, dia);

        // Converter a resposta para List<SessaoDTO> e retornar
        // ...
        List<SessaoDTO> sessoes = new ArrayList<>();

        for(Map<String, Object> sessaoData : (List<Map<String, Object>>) response.get("results")) {
            Integer id = (Integer) sessaoData.get("id");
            SessaoDTO sessaoDTO = converterSessaoParaDTO(sessaoData);
            sessoes.add(sessaoDTO);
        }
        return sessoes;
    }

    public SessaoDTO buscarSessaoPorId(Integer sessaoId) {
        Map<String, Object> sessaoData = saplClient.buscarSessaoPorId(sessaoId);
        return converterSessaoParaDTO(sessaoData);
    }

    private SessaoDTO converterSessaoParaDTO(Map<String, Object> sessaoData) {
        Integer id = (Integer) sessaoData.get("id");
        String tipoSessao = (String) sessaoData.get("tipo");
        String data = (String) sessaoData.get("data_inicio");

        // Buscar expediente e ordem do dia para cada sessão
        List<MateriaDTO> expediente = buscarExpediente(id);
        List<MateriaDTO> ordemDia = buscarOrdemDia(id);

        return new SessaoDTO(id, tipoSessao, data, expediente, ordemDia);
    }

    private List<MateriaDTO> buscarExpediente(Integer sessaoId) {
        Map<String, Object> response = saplClient.buscarExpediente(sessaoId);
        List<MateriaDTO> materias = new ArrayList<>();

        for(Map<String, Object> materiaData : (List<Map<String, Object>>) response.get("results")) {
            Integer id = (Integer) materiaData.get("id");
            MateriaDTO materiaDTO = buscarMateria(id);
            materias.add(materiaDTO);
        }
        return materias;
    }

    private List<MateriaDTO> buscarOrdemDia(Integer sessaoId) {
        Map<String, Object> response = saplClient.buscarOrdemDia(sessaoId);
        List<MateriaDTO> materias = new ArrayList<>();

        for(Map<String, Object> materiaData : (List<Map<String, Object>>) response.get("results")) {
            Integer id = (Integer) materiaData.get("id");
            MateriaDTO materiaDTO = buscarMateria(id);
            materias.add(materiaDTO);
        }
        return materias;
    }

    private MateriaDTO buscarMateria(Integer materiaId) {
        Map<String, Object> response = saplClient.buscarMateria(materiaId);
        String titulo = (String) response.get("titulo");
        String autor = (String) response.get("autor");
        String ementa = (String) response.get("ementa");
        String textoOriginal = (String) response.get("texto_original");
        String resultado = (String) response.get("resultado");

        return new MateriaDTO(titulo, autor, ementa, textoOriginal, resultado);
    }

}
