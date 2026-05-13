package cmtapira.client;

import java.util.Map;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class SaplClient {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "http://sapl.tapira.mg.leg.br/api";

    public Map<String, Object> buscarSessoes(
        String tipo,
        String ano,
        String mes,
        String dia
    ) {

        String url = BASE_URL + 
            "/sessao/sessaoplenaria/" +
            "?tipo=" + tipo +
            "&data_inicio__year=" + ano +
            "&data_inicio__month=" + mes +
            "&data_inicio__day=" + dia;

        return restTemplate.getForObject(url, Map.class);

    }

    public Map<String, Object> buscarExpediente(Integer sessaoId){
        String url = BASE_URL + "/sessao/expedientemateria/?sessao_plenaria=" + sessaoId;
        return restTemplate.getForObject(url, Map.class);
    }

    public Map<String, Object> buscarOrdemDia(Integer sessaoId){
        String url = BASE_URL + "/sessao/ordemdia/?sessao_plenaria=" + sessaoId;
        return restTemplate.getForObject(url, Map.class);
    }

    public Map<String, Object> buscarMateria(Integer materiaId){
        String url = BASE_URL + "/materia/materialegislativa/" + materiaId + "/";
        return restTemplate.getForObject(url, Map.class);
    }

    public Map<String, Object> buscarAutor(Integer autorId){
        String url = BASE_URL + "/base/autor/" + autorId + "/";
        return restTemplate.getForObject(url, Map.class);
    }

    public Map<String, Object> buscarSessaoPorId(Integer sessaoId){
        String url = BASE_URL + "/sessao/sessaoplenaria/" + sessaoId + "/";
        return restTemplate.getForObject(url, Map.class);
    }
}
