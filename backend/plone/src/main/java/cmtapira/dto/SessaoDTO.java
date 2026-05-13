package cmtapira.dto;

import java.util.List;

public class SessaoDTO {
    
    private Integer id;
    private String tipo;
    private String data;

    private List<MateriaDTO> expediente;
    private List<MateriaDTO> ordemDia;

    public SessaoDTO(
        Integer id,
        String tipo,
        String data,
        List<MateriaDTO> expediente,
        List<MateriaDTO> ordemDia
    ) {
        this.id = id;
        this.tipo = tipo;
        this.data = data;
        this.expediente = expediente;
        this.ordemDia = ordemDia;
    }

    public Integer getId() {
        return id;
    }   

    public String getTipo() {
        return tipo;
    }

    public String getData() {
        return data;
    }

    public List<MateriaDTO> getExpediente() {
        return expediente;
    }

    public List<MateriaDTO> getOrdemDia() {
        return ordemDia;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }   

    public void setData(String data) {
        this.data = data;
    }

    public void setExpediente(List<MateriaDTO> expediente) {
        this.expediente = expediente;
    }

    public void setOrdemDia(List<MateriaDTO> ordemDia) {
        this.ordemDia = ordemDia;
    }   

    
}
