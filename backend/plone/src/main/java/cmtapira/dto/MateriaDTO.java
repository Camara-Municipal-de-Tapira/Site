package cmtapira.dto;

public class MateriaDTO {
    
    private String titulo;
    private String autor;
    private String ementa;
    private String textoOriginal;
    private String resultado;

    public MateriaDTO(
        String titulo,
        String autor,
        String ementa,
        String textoOriginal,
        String resultado
    ) {
        this.titulo = titulo;
        this.autor = autor;
        this.ementa = ementa;
        this.textoOriginal = textoOriginal;
        this.resultado = resultado;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getAutor() {
        return autor;
    }

    public String getEmenta() {
        return ementa;
    }

    public String getTextoOriginal() {
        return textoOriginal;
    }

    public String getResultado() {
        return resultado;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public void setEmenta(String ementa) {
        this.ementa = ementa;
    }

    public void setTextoOriginal(String textoOriginal) {
        this.textoOriginal = textoOriginal;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

}
