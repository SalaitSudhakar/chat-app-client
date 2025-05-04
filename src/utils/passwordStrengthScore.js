export function passwordStrengthScore(password) {
  let score = 0;

  if (password.length >= 6) score++;

  if (/[a-z]/.test(password)) score++;

  if (/[A-Z]/.test(password)) score++;

  if (/\d/.test(password)) score++;

  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
}

export function passwordStrengthText(score)  {
    if(score === 0) return 'No Password';
    if(score === 1) return 'Very Weak';
    if(score === 2) return 'Weak';
    if(score === 3) return 'Normal';
    if(score === 4) return 'Strong';
    return 'Very Strong';
    
}

export function passwordStrengthBarColor(score, index) {
    if (index < score) {
      if (score <= 1) return 'bg-error';
      if (score === 2) return 'bg-warning';
      if (score === 3) return 'bg-accent';
      if (score === 4) return 'bg-info';
      return 'bg-success';
    }
    return 'bg-base-content/40';
  }
  

export function passwordStrengthTextColor(score)  {
    if(score === 0) return 'text-base-content/30';
    if(score === 1) return 'text-error';
    if(score === 2) return 'text-warning';
    if(score === 3) return 'text-accent';
    if(score === 4) return 'text-info';
    return 'text-success';
    
}